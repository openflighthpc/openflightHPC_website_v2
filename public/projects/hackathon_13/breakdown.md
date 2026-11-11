# Hypothesis

The aim of this hackathon was to explore user experience engineering and how it can be used to make learning new tools and technologies more accessible.

A key challenge when introducing users to an unfamiliar concept is catering for different levels of existing knowledge and technical ability. How can we guide someone from having no prior experience to becoming a confident, capable user without overwhelming or discouraging them along the way?

The central idea was to create a learning experience that builds confidence through small, achievable steps, encouraging users to continue exploring a concept rather than becoming frustrated and giving up.

# Approach

To address this challenge, we decided to explore the concept of a self-guided learning ladder.

The ladder was designed around six rungs, numbered 0 to 5. Rung 0 represents a user with no prior knowledge of the concept, while rung 5 represents someone who can confidently use it at an advanced level.

Each rung should introduce new skills that build upon the previous ones, allowing users to gradually develop their understanding and abilities. Importantly, every rung should provide a tangible sense of achievement. Users should be able to complete an activity, see that it has worked and feel encouraged to progress to the next stage.

We were provided with seven qualities that a successful learning ladder should demonstrate, but were given the freedom to interpret and implement these in our own ways:

1. Rung 0 assumes the user is completely new to the concept.

2. there should be a win at every single rung with the user having done something that clearly worked.

3. Ensure users don't get stuck by providing self-serve material, a user should be able to rescue themselves without seeking out another person.

4. It should be clear which rung of the ladder you're on and that you've moved up the ladder.

5. At the final rung the skills that are needed should build on all the previous levels and should be an actual advanced technique.

6. After someone has gone through the ladder the next user should be able to start from a fresh state.

7. The ladder should be hands on with whatever technologies are being learnt.

The intended completion time for each learning experience was approximately 60–90 minutes. This meant that each team had to balance the depth of the material against the need to keep the experience engaging, achievable and accessible within a relatively short timeframe.

## Team 1's Ladder

Team 1 focused on introducing users to SLURM, a workload manager used to schedule and manage jobs across computing clusters.

The learning ladder took a command-line approach, guiding users through increasingly advanced SLURM functionality. Lessons were delivered directly within the CLI, with the system accepting commands as answers whenever a particular response was expected.

This approach meant that users were learning by interacting with the actual technology rather than working through a separate tutorial.

### Level 1

The first level introduced the fundamental operations required to work with SLURM:

- Submitting jobs to the scheduler.
- Understanding and using basic job flags.
- Cancelling submitted jobs.

The objective was to give users enough knowledge to submit and manage a basic job independently.

### Level 2

Once users understood how to submit jobs, the second level explored how to inspect and understand the cluster environment.

Topics included:

- How to view what is running.
- How to view node information.
- How to find out specific information about running jobs, nodes and partitions.
- How to find out when a job will run based on running times.
- Modules.

This level helped users move beyond simply submitting jobs and develop an understanding of what was happening behind the scenes.

### Level 3

The third level introduced more control over job configuration and execution.

Topics included:

- Sbatch directives: output files and time limits.
- The different types of jobs that can be run.

This allowed users to move towards configuring jobs to suit more specific workloads and requirements.

### Level 4

The fourth level introduced users to more advanced cluster management functionality.

Topics included:

- Exploring accounting (saact).
- General admin controls.

This level aimed to broaden users' understanding of how SLURM operates beyond the perspective of an individual submitting jobs.

### Level 5

The final level explored more advanced features and techniques, building upon the knowledge gained throughout the previous levels.

Topics included:

- Exploring reservations.
- Exploring jobs communicating with each other.
- Showing how to utilise alces-job.

The intention was to expose users to more sophisticated SLURM functionality and demonstrate how the scheduler could be used to support more complex workloads.

Overall, Team 1's approach focused on keeping the learning experience close to the technology itself. By delivering the ladder entirely through the CLI, users could immediately apply what they were learning in a practical environment.

## Team 2's Ladder

Team 2 focused on teaching users how to provision and work with virtual machines.

Rather than using a traditional command-line tutorial, the team opted for a more gamified approach. They combined a quiz-based learning experience with a 2D platformer, creating a more visually engaging way for users to progress through the learning ladder.

The experience involved users navigating a platforming environment and collecting cards containing relevant learning material. These cards introduced the concepts and information needed to complete the practical challenges that followed.

The practical activities required users to apply what they had learnt, with challenges ranging from inspecting the hardware configuration of an existing virtual machine to provisioning a virtual machine from scratch.

Shown below is a selection of screenshots from team 2's ladder.
![a ScreenShot showing the platform section](extras/Team2-2D-Platformer.webp)

![a ScreenShot showing the learning card](extras/Team2-Learning-Card.webp)

![a ScreenShot showing the practical section](extras/Team2-Practical.webp)

The original plan was to implement all five levels of the learning ladder. However, due to the limited development time available during the hackathon, only three levels were completed.

Despite this, the team successfully demonstrated an alternative approach to technical learning. By combining gamification with practical exercises, they aimed to make the learning process feel more like progression through a game than working through a conventional tutorial.

The use of collected learning cards also provided a way to introduce information at relevant points, rather than overwhelming users with everything they needed to know at the beginning.

One particularly interesting aspect of this project was the use of the Phaser framework to develop the 2D platformer.

[github](https://github.com/phaserjs/phaser)

This introduced the team to a new technology and demonstrated how game development frameworks could be applied to create more engaging educational experiences.

## Team 3's Ladder

Team 3 took a different approach, focusing on the problems users encounter when following poorly written README files and development instructions.

The exemplar was a small C project, sacct-reporter 1.0 (classic edition), presented as though written in August 2009 — a hand-rolled Makefile, sample job-accounting dumps, and a README full of era-appropriate confidence. Only the provenance was fiction: the code, the dependency and the data were all real. The README was written to be read as a suspect rather than a manual, with six deliberate lies planted in it, one per rung — each lie the engine of the rung it hid in.

### Rung 0

The rung delivered exactly what the fiction promised: the tarball and its 2009 README. An environment check verified the toolchain — pointedly nothing else, so no lie could be caught by a script instead of by reading.

The win was the framing for the whole climb: treat the README as a suspect, not as documentation.

### Rung 1

The README's build instructions consisted of a single command, `./build.sh`, which no version of the project ever contained.

Users fell back to the tool the README never mentioned: the compiler itself, compiling a hello-world that printed the project's own banner — making the first win part of the fiction.

Such a lie can be seen here, as build.sh does not actually exist in the project:

![a screenshot showing Team 3's Rung 1 lie](extras/Team3-ReadmeLie.webp)

### Rung 2

The rung hunted the dependencies the README had lied about, in two parts:

- Toolchain: the README demanded gcc 4.1. Museum-hunting a 2009 compiler was the wrong lesson; the right one was recording which compiler was actually available, a reproducibility fact for later.
- Packages: the prerequisite `yum install sacct-metrics-devel` never shipped anywhere, presented alongside a "no third-party dependencies" claim.
- The transferable move: hunt by the missing file, not by the README's names — ask the package manager which package provides `zlib.h`, then install it.

### Rung 3

The rung assembled the real build against the shipped data, its problems arriving in strict order:

- `-std=gnu89`: the compiler refused the project's 2009-era function definitions — ask gcc for the code's dialect rather than rewriting the code.
- `-lz`: linking failed on undefined references to zlib. Everything compiled, but the Makefile had never told the linker about the library — which is what "no third-party dependencies" meant in practice.
- `acsacct`: the usage docs described a binary the build never produced, with modern option flags — documentation leaked backwards from a later generation of the tool. Trust the artifact over the README.
- The truth test: `make clean && make` rebuilt pristine, with the report on the sample data matching an expected checksum byte for byte.

### Rung 4

The README insisted that any optimisation beyond -O2 was pointless. A supplied benchmark script and a one-million-row dump let users answer that claim with their own timing table across -O0, -O2, -O3 and -march=native:

- -O2 ran roughly 1.7× faster than -O0.
- -O3 and -march=native settled back at essentially -O2 speed — an honest null on a workload bound by reading compressed data.
- Parallel make makes the build faster; compiler flags make the program faster.
- -march=native raised the distinctly HPC trade-off of performance versus portability across heterogeneous nodes.

### Rung 5

Each rung from 2 onwards had added one line to a pins file: the compiler, the packages, the dialect and link flags, the optimisation choice. Rung 5 turned those facts into the contract the README had pretended to be:

- A real `build.sh`, the file lie #1 had pretended existed.
- A written reproducibility document, alongside the pins file.
- Verified live: the person next to you rebuilt from a fresh environment using the instructions alone, and had to reproduce the identical checksum.

Hints supported each rung at three depths — where to look, what the actual cause is, and only then the exact fix — never costing users their progress. A one-page error oracle alongside them mapped the first line of each compiler error onto its cause and fix, so a user stuck at a rung could rescue themselves without finding another person.

![a screenshot showing Team 3's ladder](extras/Team3-Ladder.webp)

Unlike the other two teams, this learning ladder was not interactive in the traditional sense, and nothing was simulated but the provenance: the compiler, the errors and the data were all real, and the rung checks only printed their pass banner when something genuinely ran. Users progressed by investigating what had gone wrong, not by completing exercises.

By deliberately introducing these frustrations, the team demonstrated how easily an otherwise straightforward development task becomes an obstacle when documentation is unclear, incorrect or simply out of date — and that most of a "lying" README is not lying at all, but truth that has expired. The skill the ladder taught was noticing when a truth has expired, and pinning down the facts that let the next person reproduce the build.

# What was learnt

The hackathon provided an opportunity to explore different approaches to user experience engineering, particularly when designing learning experiences for users with varying levels of technical knowledge.

One of the main takeaways was that making a technology accessible involves much more than simply providing a README or a set of instructions. Documentation is important, but it does not always provide enough guidance for someone encountering a concept for the first time.

Team 3 demonstrated how poor documentation can actively hinder a user's progress, while Team 1 explored how embedding guidance directly into the command-line environment can make learning more practical and contextual.

Team 2 took this a step further by exploring how gamification can make technical learning more engaging. The use of Phaser to create a 2D platformer also provided an opportunity to experiment with a new framework and apply it in a context beyond traditional game development.

Across all three projects, several important lessons emerged:

- **Learning should be progressive**. Introducing too much information too early can overwhelm users. Breaking concepts into smaller, achievable steps helps build confidence and encourages continued engagement.

- **Practical experience matters**. Users should have opportunities to apply what they have learnt and see tangible results. Completing a working task is far more rewarding than simply reading about how something works.

- **Guidance should be accessible when needed**. Users should be able to identify what they need to do next and find help when they encounter difficulties, without relying on another person to guide them.

- **Engagement is part of the experience**. Gamification, interactive tutorials and contextual guidance can all provide alternative ways to make technical concepts more approachable.

- **Good documentation is essential, but not always sufficient**. A README may explain how to use a system, but a guided learning experience can provide the additional context and structure needed to help users understand it.
