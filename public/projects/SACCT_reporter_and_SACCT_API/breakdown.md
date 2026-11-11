# Hypothesis

The aims of both these projects was to improve the accessiblitly and readability of existing SACCT breakdowns via two methods of access:

- **CLI Tool:** A program on the cluster itself able to print out the general metrics of a cluster in operation.
- **API:** A program to interface with an active cluster using API calls to provide a JSON dump of key metrics on how the cluster is being used by the end operator.

The main reason is because SACCT itself is a tool able to give job by job breakdowns of completed and submitted jobs, however it lacks the in built tools to make general observations of cluster operations work as expected.

Thus the central challenge was defining the structure of how the general use data would be displayed to the end user to make SLURM accounting easier for the end user to understand and so see if there is any specific problem that causes the failure of specific nodes or partitions.

# Approach

The approach taken was to consolidate command line sacct reporting metrics into either a easily processable CSV/tty table format, or a JSON dump format showing the general metrics of jobs and resource usage across the entire cluster regardless of given partition.

Each section is specifically designed for a different user in mind.

For the CLI tool, it is designed for a system operator who wants to understand the current job completion statuses and if a certain partition or user data is more vunerable to a failure state, so that they can use traditional SACCT tools targeted at the known failure states to debug the program.

For the API tool it is designed for flight centre to monitor general system usage via a long distance API call using https processes. It is designed to see where the customer is using the systems to allow monitoring of how well used the cluster is and to adjust support as needed to customer usage.

Both combined can give a clear pitcure of the health of a cluster and how its jobs process on the cluster

## CLI Tool

TBD

![CLI tool output](CLI.png)

## API tool

TBD

![API command line interface](API-CLI-7.png)

![API CLI timing output](API-CLI-Time.png)

![JSON output for a 7 day period](JSON-7.png)

![JSON output with timing](JSON-Time.png)

# What was learnt

TBD

# GitHub Repositories

- [Alces-Sacct-V2](https://github.com/AdamJ2009/Alces-Sacct-V2) – CLI local program for sacct accounting.
- [SACCT_API](https://github.com/AdamJ2009/SACCT_API) – Backend API service for SACCT data with CLI tarball for API.
