# Job Cost Calculator

The goal was to analyse historical SLURM job data and estimate the cost of running existing HPC workloads on cloud infrastructure such as AWS and Azure.

# What was done

We developed a Ruby application that analyses sacct job data, identifies CPU, GPU, memory and node requirements, and recommends suitable cloud instances. Implemented per-job and whole-workload cost estimates, along with CSV exports and configurable analysis options.

# What was learnt

We learnt how to translate HPC resource requirements into cloud instance recommendations and estimate associated running costs. We also explored how historical workload data can help organisations plan cloud migrations, understand resource utilisation and make informed infrastructure budgeting decisions.
