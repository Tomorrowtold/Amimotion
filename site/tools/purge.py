"""Per-page CSS trim (thread "Redesign AmIMotion inner pages on new IA", 16 Nov 2026).

Every page inlines its whole stylesheet so the first paint needs no second request, but each page used about 88 KB
of CSS written for all 57 pages. This keeps a rule only when every class and id its selector needs can appear on the
page: the word is in the page's own HTML (classes, inline scripts, data) or in any first-party script, which may add
it later (menus, the Ask panel, reveals). Selectors that name only elements, attributes or pseudo-classes always stay,
as do @font-face, @keyframes and @property. Nothing is reordered, so the cascade is unchanged.
"""
import re

_WORD = re.compile(r"[A-Za-z_][\w-]*")


def _split_top(s, sep=","):
    """Split on sep outside brackets and parentheses."""
    out, depth, cur = [], 0, []
    for ch in s:
        if ch in "([": depth += 1
        elif ch in ")]": depth -= 1
        if ch == sep and depth == 0:
            out.append("".join(cur)); cur = []
        else:
            cur.append(ch)
    out.append("".join(cur))
    return out


def _needs(sel):
    """Class and id names a selector requires. Anything inside :not(), :is(), :where(), :has() or [attr] is optional,
    so it is dropped first: the rule stays if the rest can match."""
    s = sel
    while True:
        t = re.sub(r"\([^()]*\)", "", s)
        if t == s: break
        s = t
    s = re.sub(r"\[[^\]]*\]", "", s)
    return re.findall(r"[.#](-?[A-Za-z_][\w-]*)", s)


def _blocks(css, i=0):
    """Parse minified CSS from i into a list of (prelude, body or children) until a closing brace."""
    items = []
    n = len(css)
    while i < n:
        if css[i] == "}": return items, i + 1
        j = i
        depth = 0
        while j < n and not (css[j] in "{;" and depth == 0):
            if css[j] in "([": depth += 1
            elif css[j] in ")]": depth -= 1
            elif css[j] in "\"'":
                q = css[j]; j += 1
                while j < n and css[j] != q: j += 1
            j += 1
        if j >= n: items.append(("raw", css[i:])); return items, n
        pre = css[i:j]
        if css[j] == ";":
            items.append(("raw", pre + ";")); i = j + 1; continue
        if pre.lstrip().startswith("@") and re.match(r"\s*@(media|supports|container|layer|document)\b", pre):
            kids, i = _blocks(css, j + 1)
            items.append(("group", pre, kids)); continue
        # a plain rule or an at-rule whose body is declarations or frames: copy to the matching brace
        k, depth = j + 1, 1
        while k < n and depth:
            if css[k] == "{": depth += 1
            elif css[k] == "}": depth -= 1
            elif css[k] in "\"'":
                q = css[k]; k += 1
                while k < n and css[k] != q: k += 1
            k += 1
        items.append(("rule", pre, css[j + 1:k - 1])); i = k
    return items, i


def _emit(items, have):
    out = []
    for it in items:
        if it[0] == "raw":
            out.append(it[1])
        elif it[0] == "group":
            inner = _emit(it[2], have)
            if inner: out.append(it[1] + "{" + inner + "}")
        else:
            pre, body = it[1], it[2]
            if pre.lstrip().startswith("@"):
                out.append(pre + "{" + body + "}"); continue
            keep = [s for s in _split_top(pre) if all(w in have for w in _needs(s))]
            if keep: out.append(",".join(keep) + "{" + body + "}")
    return "".join(out)


def words(text):
    return set(_WORD.findall(text))


def trim(css, have):
    items, _ = _blocks(css)
    return _emit(items, have)


def js_words(src):
    """Words inside a script's string and template literals: the only place a script can name a class or id."""
    return words(" ".join(m.group(0) for m in re.finditer(r"'(?:\\.|[^'\\\n])*'|\"(?:\\.|[^\"\\\n])*\"|`(?:\\.|[^`\\])*`", src)))


def page_words(page):
    """Words a page can match with: its class and id values, and its inline scripts and templates."""
    attrs = " ".join(re.findall(r'\s(?:class|id)="([^"]*)"', page))
    inline = " ".join(re.findall(r"<(?:script|template)\b[^>]*>(.*?)</(?:script|template)>", page, re.S))
    return words(attrs) | words(inline)


def trim_page(page, js):
    """Trim every inline <style> of a built page against the page's own words plus js (words from first-party scripts)."""
    have = page_words(page) | js
    return re.sub(r"<style>(.*?)</style>", lambda m: "<style>" + trim(m.group(1), have) + "</style>", page, flags=re.S)
