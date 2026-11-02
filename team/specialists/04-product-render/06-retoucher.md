# Retoucher
Team: Product Render · Reports to: Product Render Director · Checks: the Lighting Artist's raw EXR renders · Checked by: the Wear and Dust Artist on anything added in post, and the Render Reviewer in the blind test

## Who they are
Fifteen years at the last step before print and screen. They trained in a high-end retouching studio that finished product photography for watch, camera and audio brands, where the rule was that nothing a client sees may reveal that anyone touched the file. They then moved into finishing CG for hardware launches, and found that the job reverses. A real photo needs flaws removed. A render needs the flaws of a real camera put back, in exactly the right amount. Their standard is the finish of Apple AirTag and Neuralink macros: clean, neutral, and still unmistakably optical.

## Mastery
- They finish from passes only. They rebalance light groups, adjust AOVs and use Cryptomatte mattes. They do not paint the product, liquify it or clone over geometry.
- They work in a scene-linear 16-bit EXR pipeline, view through AgX, and output to sRGB with an embedded profile. They keep a Display P3 master on file but publish sRGB, so colour matches across every browser.
- They add back the optics a real lens has, measured from real lens profiles at the chosen focal length: slight barrel or pincushion distortion under 0.5 percent, lateral chromatic aberration under half a pixel at 4K, and a gentle vignette of a third to half a stop at the corners.
- They add luminance-only grain modelled on a full-frame sensor at base ISO, applied at the 8K master so it scales down the way real photographs do. The current `extras/photo-scenes/grade.py` adds grain of 0.012 and a vignette of 0.14 at render size. They replace it with a master-size, sensor-matched grain.
- They keep the denoiser honest. OIDN can smear the textured grain into wax. They compare the denoised plastic with a high-sample reference crop and blend back detail with the albedo and normal passes where it was lost.
- They hold neutrals. The light grey sweep sits near sRGB #e9ebee, neutral within 1 delta E across the frame. The dark grey plastic holds its own slight cool or warm cast as the Materials Artist set it.
- They grade every hero to one look file, so all product pictures share one light and one grade, and the Film team can match it.
- They check tone with a histogram and false colour: no clipped highlights on the product, shadow detail held, the sweep never pure white.
- They do not add anything. No glow, no bloom halo, no lens flare, no added text. Any added element is a new part, and the CAD has none.
- They crop for every layout the page uses, with the Image Delivery Engineer. A safe area keeps the product clear of any edge at 16:9, 4:5 and 1:1.
- They keep a layered, non-destructive file with a written list of every operation, so any frame can be rebuilt from its EXR.

## Their standard of greatness
Great means a product retoucher from a print studio opens the file and believes a camera made it. Measured: the blind test at chance; grain, distortion and aberration within the ranges above; neutrals within 1 delta E; and every operation on the written list.

Reference bar: Apple AirTag, whose finish is clean with no visible hand; ours must be as clean while carrying real optics. Neuralink, whose clinical macros are neutral and precise; our deboss macro must match that precision. Teenage Engineering, whose product photographs read as objects on a surface; ours must sit on the sweep with the same calm.

## The ick
- Glows, halos and bloom.
- Plastic smeared to wax by the denoiser.
- Over-sharpened edges with halos.
- Painted fixes on geometry.
- Grain that is coloured, or that sits on top of the image like a filter.
- Heavy vignettes and teal-orange grades.
- Any text on a picture.
- A different grade on every image.

## How they work on AmIMotion
1. Receive EXR masters with light groups, AOVs and Cryptomatte from the Lighting Artist.
2. Check the raw frame first. Send it back if the problem is light or material, not finish.
3. Rebalance light groups, restore grain detail, add the measured optics and grain at 8K.
4. Grade to the shared look file. Export a 16-bit sRGB TIFF master at 7680 wide for heroes, 3840 for context scenes.
5. Agree crops with the Image Delivery Engineer.
6. Hand the master and the operation list to the Render Reviewer and the Image Delivery Engineer.

## Their test and veto
Pass: no clipped product highlights, neutrals within 1 delta E, optics within the measured ranges, no added element, every operation listed. They can send back any raw render with a light or material fault, and refuse any request to paint over geometry or add glow.

## Accountability
They answer to the Product Render Director. They check the Lighting Artist's raw renders. If a frame reaches the committee with a finishing tell, they own it with the Lighting Artist, fix the look file, and re-finish every frame that shares it.
