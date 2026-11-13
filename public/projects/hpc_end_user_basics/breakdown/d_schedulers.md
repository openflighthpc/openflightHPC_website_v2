## Job Schedulers

# Job Scheduler Basics

# What is a Job?

A job can be loosely defined as an automated research task, for example, a bash script that runs various stages in an OpenFoam simulation on a model.

Jobs vary in size, resource usage and run time. A job could utilise multiple cores through parallel libraries or simply run on a single core.

# What is a Scheduler?

Most existing HPC environments are managed by a job scheduler; also known as the batch scheduler, workload manager, queuing system, or load-balancer. The scheduler allows multiple users to fairly share compute nodes, allowing system administrators to control how resources are made available to different groups of users. All schedulers are designed to perform the following functions:

- Allow users to submit new jobs to the research environment
- Allow users to monitor the state of their queued and running jobs
- Allow users and system administrators to control running jobs
- Monitor the status of managed resources including system load, memory available, etc.

When a new job is submitted by a user, the research environment scheduler software assigns compute cores and memory to satisfy the job requirements. If suitable resources are not available to run the job, the scheduler adds the job to a queue until enough resources are available for the job to run. You can configure the scheduler to control how jobs are selected from the queue and executed on research environment nodes, including automatically preparing nodes to run parallel MPI jobs. Once a job has finished running, the scheduler returns the resources used by the job to the pool of free resources, ready to run another user job.

# Why use a Scheduler?

Good question. A job-scheduler is often used as a control mechanism to make sure that users don't unfairly monopolise the valuable compute resources. In extreme cases, the scheduler may be wielded by system administrators to force “good behaviour” in a shared environment, and can feel like an imposition to research environment users.

However, a job-scheduler can still be a useful tool for a research environment rather than just a control mechanism:

1. It can help you organise multi-stage work flows, with batch jobs launching subsequent jobs in a defined process.
2. It can automate launching of MPI jobs, finding available nodes to run applications on.
3. It can help prevent accidentally over-allocating CPUs or memory, which could lead to nodes failing.
4. It can help bring discipline to the environment, providing a consistent method to replicate the running of jobs in different environments.

Your research environment comes with a job-scheduler installed, ready for you to start using. The scheduler uses very few resources when idle, so you can choose to use it if you find it useful, or run jobs manually across your research environment if you prefer.

:::page-break

# Types of Compute Job

# Local Job

### Why Run a Local Job?

When using a personal research environment there isn't a need to monitor resource usage as closely as multi-user systems where miscommunication and overloaded resources can negatively impact research progress. With all the resources available to one user it is quicker and easier to run jobs simply through a terminal than using a queue system.

Local jobs also have the benefit over schedulers by launching immediately and providing all output through a single terminal.

### Running a Local Job

Local job scripts can be written in any language supported within the research environment. In most cases this is likely to be bash as it's a flexible and functional shell scripting language which enables users to intuitively navigate the filesystem, launch applications and manage data output.

In the event that a job script is executable, contains a shebang(#!) specifying the launch language, and is in the current directory, it's as simple to run as:

```bash
[flight@chead1 ~]$ ./myjob.sh
```

# Scheduler Jobs

Users can run a number of different types of job via the research environment scheduler, including:

- **Batch jobs:** single-threaded applications that run only on one compute core
- **Array jobs:** two or more similar batch jobs which are submitted together for convenience
- **SMP or multi-threaded jobs:** multi-threaded applications that run on two or more compute cores on the same compute node
- **Parallel jobs:** multi-threaded applications making use of an MPI library to run on multiple cores spread over one or more compute nodes

The research environment job-scheduler is responsible for finding compute nodes in your research environment to run all these different types of jobs on. It keeps track of the available resources and allocates jobs to individual groups of nodes, making sure not to over-commit CPU and memory. The example below shows how a job-scheduler might allocate jobs of different types to a group of 8-CPU-core compute nodes:

![Chart showing how a scheduler works with different job types](./extras/tetris.webp)

### Interactive and Batch Jobs

Users typically interact with research environments by running either interactive or batch (also known as non-interactive) jobs.

- An interactive job is one that the user directly controls, either via a graphical interface or by typing at the command-prompt.
- A batch job is run by writing a list of instructions that are passed to compute nodes to run at some point in the future.

Both methods of running jobs can be equally as efficient, particularly on a personal, ephemeral research environment. Both classes of job can be of any type - for example, it's possible to run interactive parallel jobs and batch multi-threaded jobs across your research environment. The choice of which class of job-type you want to use will depend on the application you're running, and which method is more convenient for you to use.

:::page-break
