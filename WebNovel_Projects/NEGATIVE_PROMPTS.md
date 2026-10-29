# IMMUTABLE NEGATIVE PROMPTS & VISUAL GUARDRAILS
**Project:** ZealPlane Webtoon: Episode 1 (*Game of Death: Blood & Khaki*)  
**Status:** STRICT PERMANENT PRODUCTION LOCK  
**Rule:** MUST be appended / enforced on every single image generation prompt to protect image generation quota and prevent style/continuity degradation.

---

## THE MASTER NEGATIVE PROMPT BLOCK

```text
[NEGATIVE PROMPT / STRICT EXCLUSIONS]:
1. AESTHETIC & TEXTURE (NO AI/PLASTIC LOOK):
   3d cgi, 3d render, unreal engine 5, octane render, blender model, digital doll face, porcelain skin, airbrushed skin, oily skin highlights, glossy plastic sheen, smooth gradient shading, wax figure, hyper-polished video game cutscene, photographic realism, western superhero comic style, soft airbrushing, digital smudge.

2. COMPOSITION & PERSPECTIVE (NO MIRRORING / SYMMETRY):
   symmetrical composition, mirrored buildings, mirrored alley walls, symmetrical shopfronts, mirrored character poses, twin postures, tunnel vision, cloned architecture, repetitive identical shutters on both sides, center-line symmetry.

3. SCRIPT & TYPOGRAPHY BLEED (NO KOREAN/HALLUCINATIONS):
   korean text, hangul characters, hanja, japanese text, kanji, hiragana, katakana, chinese text, reversed english letters, mirrored typography, backwards text, gibberish squiggles, floating neon sign clusters, floating text boxes.

4. CULTURAL & ARCHITECTURAL DRIFT (NO EAST ASIAN / WESTERN SETTINGS):
   seoul street, shinjuku alley, tokyo neon, cyberpunk city, east asian architecture, futuristic sci-fi city, western alleyway, clean modern sidewalks, foreign utility poles.

5. CHARACTER CONTINUITY & PHYSICAL GLITCHES:
   duplicate bald characters, cloned face models, multiple cigarettes, floating cigarettes, cigarette in both hands, extra fingers, malformed hands, mutated wrists, floating props, duplicate currency notes, notes sticking out of empty pockets.

6. LINEWORK & FINISH:
   blurry lineart, missing ink outlines, sketch draft, unfinished pencils, watercolor bleeding, washed-out tones.
```

---

## MANDATORY POSITIVE PAIRING TOKENS

To guarantee the anti-plastic 2D manhwa aesthetic without ambiguity, every prompt MUST include these stylistic positive tokens:
* `authentic gritty 2D Korean webtoon manhwa line art (Solo Leveling and Castle comic style)`
* `sharp black ink contour lines with varied line weights`
* `pen cross-hatching shadows on skin and clothing`
* `flat matte 2-tone cel-shading (strictly no airbrush gradients)`
* `comic paper screentone grain texture`
* `asymmetrical dynamic framing (Dutch tilt / over-the-shoulder / one-wall perspective)`
