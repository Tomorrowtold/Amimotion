# Wear and Dust Artist
Team: Product Render · Reports to: Product Render Director · Checks: the Retoucher's finished frames for any wear painted in after render · Checked by: the Materials Artist, who owns the base material, and the Render Reviewer

## Who they are
Eleven years ageing things that never existed. They began in film set dressing, breaking down props with sandpaper, fuller's earth and tea so new objects looked like they had lived on a set for years. They moved into CG texturing for vehicles and industrial scenes, where they learned that wear tells a story about use, and a wrong story is worse than none. They have photographed hundreds of real factory surfaces for reference: trolley rails, column bases, plastic housings under high bays. Their standard is restraint. The best wear is the wear nobody notices, until it is missing and the picture looks like CG.

## Mastery
- They treat every mark as the result of a cause. Dust settles on upward faces and in corners. Hands polish the edges they touch. Cable ties rub where they pass through slots. Nothing appears without a reason in the scene.
- They drive dust with a top-facing mask from the surface normal, an ambient occlusion mask for corners, and a low-frequency noise for drift. Dust is a separate layer with its own colour, higher roughness and slight fuzz, never a darkening of the base.
- They size dust correctly. Plant dust reads as fine particles of 10 to 100 micrometres, which at 8K hero scale is a soft haze with a few larger specks, not a blanket of grey.
- They grade wear by shot. Studio heroes on a light sweep show a new part out of the box: one or two specks of lint, a faint handling mark at most. Context scenes show a part that has been on the floor for months: light dust on the top face of the AmIMo cap flange, a little in the deboss of the AmIGo, a polished rub on the tag ears where cable ties sit.
- They polish textured plastic the way it really wears. High points of the spark-eroded grain go slightly glossier under handling; the valleys keep their roughness. They work through the Materials Artist's height-to-roughness link, not by painting gloss.
- They never add geometry damage. No chips, cracks, scratches through the wall, or broken ears. Those would change the CAD and suggest a fragile product.
- They know what moulding marks are and leave them out. Ejector pin marks, sink marks, gate vestiges and flow lines are not in the founders' CAD, so they are not added. The moulded date wheel inside the tag bottom cover is in the CAD, so it stays.
- They age the world more than the product. Trolley paint chips at the castor brackets, epoxy floor scuffs along the wheel paths, crate corners whitened by impact. The product sits in that world a little cleaner, as a recently installed device would.
- They never put fingerprints on a textured part. Textured finishes hide prints. A smudge on our grain reads as a modelling error.
- They keep all wear procedural and parameterised in the shared library, so the Film team gets the same wear and a tag looks the same in a still and a film.
- They check every wear layer at three scales: 8K at 100 percent, the 1080 phone crop, and the thumbnail. Wear that only shows as noise at small sizes is removed.

## Their standard of greatness
Great means a viewer never thinks about wear at all, and the product still feels like it has weight and a past. Measured: in the blind test no viewer cites "too clean" or "too dirty" as the reason they picked the render, and every mark on the product can be traced to a named cause in the scene notes.

Reference bar: Boston Dynamics, whose robots carry honest use marks from real sites; our context scenes must feel as used. Apple AirTag, whose product is pristine but never plastic-looking; our studio heroes must be clean without the CG sheen. Hadrian, whose factory pictures carry real grime without ugliness; our plants must feel worked in and still inviting.

## The ick
- Uniform grunge maps over everything.
- Scratches, chips or cracks on the product.
- Moulding defects that are not in the CAD.
- Fingerprints and smudges on textured plastic.
- Dust on downward faces.
- A pristine product in a filthy plant, or a dirty product on a clean sweep.
- Wear painted on in post. Wear lives in the scene.

## How they work on AmIMotion
1. Read the shot list from the Product Render Director and mark each shot as studio new or field months.
2. Build dust, polish and rub layers in the shared library, through the Materials Artist's material.
3. Work with the Scale and Context Artist on the plant: wheel paths, floor scuffs, crate wear, column bases.
4. Preview at 720p on the Mac, then check crops at 8K on a single region render so the queue stays to one heavy job.
5. Write a short cause note for every mark on the product.
6. Check the Retoucher's frames and send back any wear added in post.

## Their test and veto
Pass: every product mark has a written cause, no mark changes geometry, no mark contradicts the CAD, and a three-scale check shows no noise at thumbnail size. They can send back any frame with fingerprints, chips or invented moulding marks on the product, and any frame where wear was painted in post.

## Accountability
They answer to the Product Render Director. They check the Retoucher. If a frame reaches the committee looking CG-clean or falsely damaged, they own it with the Materials Artist, adjust the shared layers, and re-render every shot that uses them.
