## Slurm

:::collapse Further Documentation

# Further Documentation

This guide is a quick overview of some of the many available options of the SLURM research environment scheduler. For more information on the available options, you may wish to reference some of the following available documentation for the demonstrated SLURM commands:

- Use the `man squeue` command to see a full list of scheduler queue instructions.
- Use the `man sbatch/srun` command to see a full list of scheduler submission instructions.
- Online documentation for the SLURM scheduler is [available here](https://slurm.schedmd.com/documentation.html)

:::

### Running Jobs

:::collapse Submitting an Interactive Job

# Submitting an Interactive Job

You can start a new interactive job on your research environment by using the `srun` command; the scheduler will search for an available compute node, and provide you with an interactive login shell on the node if one is available.

```bash
[flight@chead1 (mycluster1) ~]$ srun --pty /bin/bash
[flight@node01 (mycluster1) ~]$
[flight@node01 (mycluster1) ~]$ squeue
           JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
               3       all     bash    centos R       0:39      1 node01
```

In the above example, the `srun` command is used together with two options: `--pty` and `/bin/bash`. The `--pty` option executes the task in pseudo terminal mode, allowing the session to act like a standard terminal session. The `/bin/bash` option is the command that you wish to run - here the default Linux shell, BASH.

Alternatively, the `srun` command can also be executed from an interactive desktop session; the job-scheduler will automatically find an available compute node to launch the job on. Applications launched from within the `srun` session are executed on the assigned research environment compute node.

![Image showing an interactive job](./extras/interactivejob.webp)

The Slurm scheduler does not automatically set up your session to allow you to run graphical applications inside an interactive session. Once your interactive session has started, you must run the following command before running a graphical application: `export DISPLAY=chead1$DISPLAY` (where `chead1` is the name of the login system)

Running X applications from a compute node may not work due to missing X libraries on the compute node, these can be installed from an SSH session into a compute node with `sudo yum groupinstall "X Window System"`

When you've finished running your application in your interactive session, simply type `logout`, `exit`, or press **Ctrl+D** to exit the interactive job.

If the job-scheduler could not satisfy the resource you've requested for your interactive job (e.g. all your available compute nodes are busy running other jobs), it will report back after a few seconds with an error:

```bash
[flight@chead1 (mycluster1) ~]$ srun --pty /bin/bash
srun: job 20 queued and waiting for resources
```

:::

:::collapse Submitting a Batch Job

Batch (or non-interactive) jobs allow users to leverage one of the main benefits of having a research environment scheduler; jobs can be queued up with instructions on how to run them and then executed across the research environment while the user [does something else](https://www.quora.com/What-do-you-do-while-youre-waiting-for-your-code-to-finish-running). Users submit jobs as scripts, which include instructions on how to run the job - the output of the job (stdout and stderr in Linux terminology) is written to a file on disk for review later on. You can write a batch job that does anything that can be typed on the command-line.

We'll start with a basic example - the following script is written in bash (the default Linux command-line interpreter). You can create the script yourself using the [Nano](https://www.howtogeek.com/howto/42980/the-beginners-guide-to-nano-the-linux-command-line-text-editor/) command-line editor - use the command `nano simplejobscript.sh` to create a new file, then type in the contents below. The script does nothing more than print some messages to the screen (the echo lines), and sleeps for 120 seconds. We've saved the script to a file called `simplejobscript.sh` - the `.sh` extension helps to remind us that this is a shell script, but adding a filename extension isn't strictly necessary for Linux.

```bash
#!/bin/bash -l
echo "Starting running on host $HOSTNAME"
sleep 120
echo "Finished running - goodbye from $HOSTNAME"
```

We use the `-l` option to bash on the first line of the script to request a login session. This ensures that environment modules can be loaded as required as part of your script.

We can execute that script directly on the login node by using the command `bash simplejobscript.sh` - after a couple of minutes, we get the following output:

```bash
Started running on host chead1
Finished running - goodbye from chead1
```

To submit your job script to the research environment job scheduler, use the command `sbatch simplejobscript.sh`. The job scheduler should immediately report the job-ID for your job; your job-ID is unique for your current research environment - it will never be repeated once used.

```bash
[flight@chead1 (mycluster1) ~]$ sbatch simplejobscript.sh
Submitted batch job 21

[flight@chead1 (mycluster1) ~]$ ls
simplejobscript.sh  slurm-21.out

[flight@chead1 (mycluster1) ~]$ cat slurm-21.out
Starting running on host node01
Finished running - goodbye from node01
```

:::

:::collapse Submitting an Array Job

# Submitting an Array Job

A common workload is having a large number of jobs to run which basically do the same thing, aside perhaps from having different input data. You could generate a job-script for each of them and submit it, but that's not very convenient - especially if you have many hundreds or thousands of tasks to complete. Such jobs are known as **task arrays** - an [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel) job will often fit into this category.

A convenient way to run such jobs on a research environment is to use a task array, using the `-a [array_spec] | --array=[array_spec]` directive. Your job-script can then use the pseudo environment variables created by the scheduler to refer to data used by each task in the job. The following job-script uses the `$SLURM_ARRAY_TASK_ID/%a` variable to echo its current task ID to an output file:

```bash
#!/bin/bash -l
#SBATCH --job-name=array
#SBATCH --output=output.array.%A.%a
#SBATCH --array=1-1000
echo "I am $SLURM_ARRAY_TASK_ID from job $SLURM_ARRAY_JOB_ID"
```

Once submitted, we can see the various iterations of this array on the queue:

```bash
[flight@chead1 (mycluster1) ~]$ sbatch arrayjob.sh
Submitted batch job 77
[flight@chead1 (mycluster1) ~]$ squeue
           JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    77_[85-1000]       all    array    centos PD       0:00      1 (Resources)
           77_71       all    array    centos  R       0:00      1 node03
           77_72       all    array    centos  R       0:00      1 node06
           77_73       all    array    centos  R       0:00      1 node03
           77_74       all    array    centos  R       0:00      1 node06
           77_75       all    array    centos  R       0:00      1 node07
           77_76       all    array    centos  R       0:00      1 node07
           77_77       all    array    centos  R       0:00      1 node05
           77_78       all    array    centos  R       0:00      1 node05
           77_79       all    array    centos  R       0:00      1 node02
           77_80       all    array    centos  R       0:00      1 node04
           77_81       all    array    centos  R       0:00      1 node01
           77_82       all    array    centos  R       0:00      1 node01
           77_83       all    array    centos  R       0:00      1 node02
           77_84       all    array    centos  R       0:00      1 node04
```

All tasks in an array job are given a job ID with the format `[job_ID]_[task_number]` e.g. `77_81` would be job number 77, array task 81.

Array jobs can easily be cancelled using the `scancel` command - the following examples show various levels of control over an array job:

- Cancel all array tasks under the job ID `77`

```bash
scancel 77
```

- Cancel array tasks `100-200` wunder the job ID `77`

```bash
scancel 77_[100-200]
```

- Cancel array task `5` under the job ID `77`

```bash
scancel 77_5
```

:::

:::collapse Job Configuration

# Job Configuration

In order to promote efficient usage of the research environment - the job-scheduler is automatically configured with default run-time limits for jobs. These defaults can be overridden by users to help the scheduler understand how you want it to run your job.

Job instructions can be provided in two ways; they are:

1. **On the command line**, as parameters to your `sbatch` or `srun` command. For example, you can set the name of your job using the `--job-name=[name] | -J [name]` option:

```bash
[flight@chead1 (mycluster1) ~]$ sbatch --job-name=mytestjob simplejobscript.sh
Submitted batch job 51

[flight@chead1 (mycluster1) ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                51       all mytestjo    centos  R       0:02      1 node01
```

2. **In your job script**, by including scheduler directives at the top of your job script - you can achieve the same effect as providing options with the `sbatch` or `srun` commands. Create an example job script or modify your existing script to include a scheduler directive to use a specified job name:

```bash
#!/bin/bash -l
#SBATCH --job-name=mytestjob
echo "Starting running on host $HOSTNAME"
sleep 120
echo "Finished running - goodbye from $HOSTNAME"
```

Including job scheduler instructions in your job-scripts is often the most convenient method of working for batch jobs - follow the guidelines below for the best experience:

- Lines in your script that include job-scheduler directives must start with `#SBATCH` at the beginning of the line.
- You can put multiple instructions separated by a space on a single line starting with `#SBATCH`
- The scheduler will parse the script from top to bottom and set instructions in order; if you set the same parameter twice, the second value will be used.
- Instructions are parsed at job submission time, before the job itself has actually run. This means you can't, for example, tell the scheduler to put your job output in a directory that you create in the job-script itself - the directory will not exist when the job starts running, and your job will fail with an error.
- You can use dynamic variables in your instructions (see next)

After `#!/bin/bash -l` write all of your `#SBATCH` lines. As soon as the interpreter reads a normal script line it will stop looking for `#SBATCH` lines.

[More information on this](https://slurm.schedmd.com/sbatch.html#SECTION_DESCRIPTION)

# Common Job Configuration Examples

### Setting Output File Location

To set the output file location for your job, use the `-o [file_name] | --output=[file_name]` option - both standard-out and standard-error from your job-script, including any output generated by applications launched by your job-script will be saved in the filename you specify.

By default, the scheduler stores data relative to your home-directory - but to avoid confusion, we recommend specifying a full path to the filename to be used. Although Linux can support several jobs writing to the same output file, the result is likely to be garbled - it's common practice to include something unique about the job (e.g. its job-ID) in the output filename to make sure your job's output is clear and easy to read.

Note: The directory used to store your job output file must exist and be writable by your user before you submit your job to the scheduler. Your job may fail to run if the scheduler cannot create the output file in the directory requested.

The following example uses the `--output=[file_name]` instruction to set the output file location:

```bash
#!/bin/bash -l
#SBATCH --job-name=myjob --output=output.%j

echo "Starting running on host $HOSTNAME"
sleep 120
echo "Finished running - goodbye from $HOSTNAME"
```

In the above example, assuming the job was submitted as the `centos` user and was given the job-ID number `24`, the scheduler will save the output data from the job in the filename `/home/centos/output.24`.

### Setting Working Directory

By default, jobs are executed from your home-directory on the research environment (i.e. `/home/<your-user-name>`, `$HOME` or `~`). You can include cd commands in your job-script to change to different directories; alternatively, you can provide an instruction to the scheduler to change to a different directory to run your job. The available options are:

`-D | --workdir=[dir_name]` - instruct the job scheduler to move into the directory specified before starting to run the job on a compute node

The directory specified must exist and be accessible by the compute node in order for the job you submitted to run.

### Waiting for a Previous Job Before Running

You can instruct the scheduler to wait for an existing job to finish before starting to run the job you are submitting with the z-d [state:job_id] | --depend=[state:job_id]z option. For example, to wait until the job with ID 75 has finished before starting the job, you could use the following syntax:

```bash
[flight@chead1 (mycluster1) ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                75       all    myjob    centos  R       0:01      1 node01

[flight@chead1 (mycluster1) ~]$ sbatch --dependency=afterok:75 mytestjob.sh
Submitted batch job 76

[flight@chead1 (mycluster1) ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                76       all    myjob    centos PD       0:00      1 (Dependency)
                75       all    myjob    centos  R       0:15      1 node01
```

:::

:::collapse Dynamic Scheduler Variables

# Dynamic Scheduler Variables

Your research environment job scheduler automatically creates a number of pseudo environment variables which are available to your job-scripts when they are running on research environment compute nodes, along with standard Linux variables. Useful values include the following:

- `$HOME` The location of your home directory
- `%u` / `$USER` The Linux username of the submitting user. The `%u` substitution should only be used in your job scheduler filename directives.
- `$HOSTNAME` The Linux hostname of the compute node running the job
- `%a` / `$SLURM_ARRAY_TASK_ID` Job array ID (index) number. The `%a` substitution should only be used in your job scheduler filename directives[^1]
- `%A` / `$SLURM_ARRAY_JOB_ID` Job allocation number for an array job. The `%A` substitution should only be used in your job scheduler filename directives
- `%j` / `$SLURM_JOBID` Job allocation number. The %j substitution should only be used in your job scheduler filename directives

[More information on this.](https://slurm.schedmd.com/sbatch.html#SECTION_%3CB%3Efilename-pattern%3C/B%3E)
:::

:::collapse Requesting More Resources

# Requesting More Resources

By default, jobs are constrained to the default set of resources - users can use scheduler instructions to request more resources for their jobs. The following documentation shows how these requests can be made.

# Running Multi-Threaded Jobs

If users want to use multiple cores on a compute node to run a multi-threaded application, they need to inform the scheduler - this allows jobs to use multiple cores without needing to rely on any interconnect. Using multiple CPU cores is achieved by specifying the `-n` or `--ntasks=<number>` option in either your submission command or the scheduler directives in your job script. The `--ntasks` option informs the scheduler of the number of cores you wish to reserve for use. If the parameter is omitted, the default `--ntasks=1` is assumed. You could specify the option `-n 4` to request 4 CPU cores for your job. Besides the number of tasks, you will need to add `--nodes=1` to your scheduler command or at the top of your job script with `#SBATCH --nodes=1`, this will set the maximum number of nodes to be used to 1 and prevent the job selecting cores from multiple nodes.

```batch
#!/bin/bash -l
#SBATCH --nodes=2
#SBATCH --ntasks=2
#SBATCH --mem=200
echo "Example asking for 2 CPU cores and 2 nodes"
```

If you request more cores than are available on a node in your research environment, the job will not run until a node capable of fulfilling your request becomes available. The scheduler will display the error in the output of the `squeue` command

# Running Parallel (MPI) Jobs

If users want to run parallel jobs via a messaging passing interface (MPI), they need to inform the scheduler - this allows jobs to be efficiently spread over compute nodes to get the best possible performance. Using multiple CPU cores across multiple nodes is achieved by specifying the `-N` or `--nodes=<minnodes[-maxnodes]>` option - which requests a minimum (and optional maximum) number of nodes to allocate to the submitted job. If only the `minnodes` count is specified - then this is used for both the minimum and maximum node count for the job.

- Example of how to request a minimum of 1 node and maximum of 4.

```bash
--nodes=1-4
```

You can request multiple cores over multiple nodes using a combination of scheduler directives either in your job submission command or within your job script. Some of the following examples demonstrate how you can obtain cores across different resources:

- Request 16 cores across 2 compute nodes

```bash
--nodes=2 --ntasks=16
```

- Request all available cores of 2 compute nodes

```bash
--nodes=2
```

- Request 16 cores across any available compute nodes

```bash
--ntasks=16
```

If you request more CPU cores than your research environment can accommodate, your job will wait in the queue.

# Requesting More Memory

In order to promote best use of the research environment scheduler - particularly in a shared environment, it is recommended to inform the scheduler the maximum required memory per submitted job. This helps the scheduler appropriately place jobs on the available nodes in the research environment.

You can specify the maximum amount of memory required per submitted job with the `--mem=<MB>` option. This informs the scheduler of the memory required for the submitted job. Optionally - you can also request an amount of memory per CPU core rather than a total amount of memory required per job. To specify an amount of memory to allocate per core, use the `--mem-per-cpu=<MB>` option.

Examples:

- `--mem=200` - Requesting 200MB of memory.
- `--mem-per-cpu=10` - Requesting 10MB of memory per CPU.

When running a job across multiple compute hosts, the `--mem=<MB>` option informs the scheduler of the required memory per node

# Requesting a Longer Runtime

In order to promote best-use of the research environment scheduler, particularly in a shared environment, it is recommend to inform the scheduler the amount of time the submitted job is expected to take. You can inform the research environment scheduler of the expected runtime using the `-t`, `--time=<time>` option. For example - to submit a job that runs for 2 hours, the following example job script could be used:

```bash
#!/bin/bash -l
#SBATCH --job-name=sleep
#SBATCH -D $HOME/
#SBATCH --time=0-2:00
sleep 7200
```

You can then see any time limits assigned to running jobs using the command `squeue --long`:

```bash
[flight@chead1 (mycluster1) ~]$ squeue --long
Tue Aug 30 10:55:55 2016
             JOBID PARTITION     NAME     USER    STATE       TIME TIME_LIMI  NODES NODELIST(REASON)
              1163       all    sleep    centos  RUNNING       0:07   2:00:00      1 ip-10-75-1-42
```

:::

### Running Jobs

:::collapse Viewing and Controlling Queued Jobs

# Viewing and Controlling Queued Jobs

Once your job has been submitted, use the `squeue` command to view the status of the job queue. If you have available compute nodes, your job should be shown in the `R` (running) state; if your compute nodes are busy your job may be shown in the `PD` (pending) state until compute nodes are available to run it. If a job is in `PD` state - the reason for being unable to run will be displayed in the `NODELIST(REASON)` column of the `squeue` output.

```bash
[flight@chead1 (mycluster1) ~]$ squeue
         JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
            41       all simplejo    centos  R       0:03      1 node01
            42       all simplejo    centos  R       0:00      1 node01
```

You can keep running the `squeue` command until your job finishes running and disappears from the queue. The output of your batch job will be stored in a file for you to look at. The default location to store the output file is your home directory. You can use the linux `more` command to view your output file:

```bash
[flight@chead1 (mycluster1) ~]$ more slurm-42.out
Starting running on host node01
Finished running - goodbye from node01
```

Your job runs on whatever node the scheduler can find which is available for use - you can try submitting a bunch of jobs at the same time, and using the `squeue` command to see where they run. The scheduler is likely to spread them around over different nodes (if you have multiple nodes). The login node is not included in your research environment for scheduling purposes - jobs submitted to the scheduler will only be run on your research environment compute nodes. You can use the `scancel <job-ID>` command to delete a job you've submitted, whether it's running or still in the queued state.

```bash
[flight@chead1 (mycluster1) ~]$ sbatch simplejobscript.sh
Submitted batch job 46
[flight@chead1 (mycluster1) ~]$ sbatch simplejobscript.sh
Submitted batch job 47
[flight@chead1 (mycluster1) ~]$ sbatch simplejobscript.sh
Submitted batch job 48
[flight@chead1 (mycluster1) ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                43       all simplejo    centos  R       0:04      1 node01
                44       all simplejo    centos  R       0:04      1 node01
                45       all simplejo    centos  R       0:04      1 node02
                46       all simplejo    centos  R       0:04      1 node02
                47       all simplejo    centos  R       0:04      1 node03
                48       all simplejo    centos  R       0:04      1 node03

[flight@chead1 (mycluster1) ~]$ scancel 47
[flight@chead1 (mycluster1) ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                43       all simplejo    centos  R       0:11      1 node01
                44       all simplejo    centos  R       0:11      1 node01
                45       all simplejo    centos  R       0:11      1 node02
                46       all simplejo    centos  R       0:11      1 node02
                48       all simplejo    centos  R       0:11      1 node03
```

:::

:::collapse Viewing Compute Host Status

# Viewing Compute Host Status

Users can use the `sinfo -Nl` command to view the status of compute node hosts in your research environment.

```bash
[flight@chead1 (mycluster1) ~]$ sinfo -Nl
Fri Aug 26 14:46:34 2016
NODELIST        NODES PARTITION       STATE CPUS    S:C:T MEMORY TMP_DISK WEIGHT AVAIL_FE REASON
node01       1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node02      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node03      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node04      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node05      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node06      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
node07      1      all*        idle    2    2:1:1   3602    20462      1   (null) none
```

The `sinfo -Nl output will show (from left-to-right):

- The hostname of your compute nodes
- The number of nodes in the list
- The node partition the node belongs to
- Current usage of the node - if no jobs are running, the state will be listed as `idle`. If a job is running, the state will be listed as `allocated`
- The detected number of CPUs (including hyper-threaded cores)
- The number of sockets, cores and threads per node
- The amount of memory in MB per node
- The amount of disk space in MB available to the `/tmp` partition per node
- The scheduler weighting

Using the command `sinfo` without `-Nl` will display only some information and in a different order.

```bash
[flight@chead1 (mycluster1) ~]$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
all*         up   infinite      2   idle cnode[01-02]
```

:::

:::collapse Viewing Default Resources

# Viewing Default Resources

In order to promote efficient usage of your research environment, the job-scheduler automatically sets a number of default resources for your jobs when you submit them. These defaults must be overridden by users to help the scheduler understand how you want it to run your job - if we don't include any instructions to the scheduler, then our job will take the defaults shown below:

- Number of CPU cores for your job: 1
- Number of nodes for your job: the default behavior is to allocate enough nodes to satisfy the requirements of the number of CPUs requested

You can view all default resource limits by running the following command:

```bash
[root@chead1(mycluster1) ~]# scontrol show config | grep Def
CpuFreqDef              = Unknown
DefMemPerNode           = UNLIMITED
MpiDefault              = none
SallocDefaultCommand    = (null)
```

This documentation will explain how to change these limits to suit the jobs that you want to run. You can also disable these limits if you prefer to control resource allocation manually by yourself.

:::
