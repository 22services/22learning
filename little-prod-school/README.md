# Little Prod School

Music theory for producers, explained like you're 7. It has 21 short narrated "video" lessons. Each one is an animated scene with real synthesized sound and spoken narration, followed by a quiz. They are built from the transcripts of Vilmyllow's two videos:

- Video 1, [La théorie musicale expliquée](https://youtu.be/pUXneU5dww8): chapter 1 the time grid (4/4, strong/weak beats, binary/ternary), chapter 2 notes (12 keys, octaves, Do = C, sharps/flats), chapter 3 scales (major/minor recipes, relative scales, degrees).
- Video 2, [Tes mélodies vont changer, après cette vidéo](https://youtu.be/HZH2dqoXZhA): chapter 4 chords (intervals, triads, 7ths, sus, extended), chapter 5 progressions (degrees, 5 steps in A minor, 5 enrichment tricks), chapter 6 melodies (6 pillar effects, question/answer, twin/cousin/octave phrases).

Open `index.html` in Chrome, Edge or Safari with the sound on.

## What's in the page

- **Narration.** The narrator is the browser's built-in voice; without one, the captions advance on their own.
- **Quizzes.** About 75 questions: multiple choice, listening (major or minor, steps, sus or normal…) and tap-the-piano questions. Stars are saved in the browser, and there is also a 15-question "big quiz".
- **Free play keyboard.** Highlights a scale and plays its diatonic chords with their degrees.
- **Word bank.** English term → French term from the video → kid-sized meaning.
- **Grown-up corner.** Each lesson notes where a video simplifies or slips, for example that the 7th degree of natural minor is the *sous-tonique* rather than the *sensible*, and that FL Studio names middle C "C5".

## Files

- `index.html`: the page (layout, styles, player shell)
- `engine.js`: Web Audio synth, SVG stage components (keyboard, piano roll, snowman chords, pizzas…), player, quiz, free play
- `lessons.js`: the 21 lessons (scenes, narration, demos, quizzes)

Keys: Space play/pause · ←/→ scenes. On the free play keyboard, A W S E D F T G Y H U J K play from C.
