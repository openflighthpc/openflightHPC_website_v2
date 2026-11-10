# Week 4

## API

In week 4 I worked on implementing the new features brought into the VVIZ into the API so that they can be brought into the frontend, this also came with more improvements to filtering on get endpoints allowing for more ways to filter returned data.
I also worked on improving the CLI to handle the new features I added to the API as well as improving its handling of logging in users.

As well as this I also worked on taking parts of my most recent API and implementing them into an API skeleton i’ve made to help with creating APIs in the future, some of the things i’ve taken is a new error handler for the API as well as streamlining other parts of the skeleton to make it easier to work with and more lightweight making it easy to work with and build on top of.

Github links:

[api skeleton](https://github.com/acegoal07/Hono-API-Skeleton)
[vem2 cli](https://gitlab.dmz.alces.network/dev/vem2-cli)
[vem2 api](https://gitlab.dmz.alces.network/dev/vem2-api)

### Continuing

#### Oscar

##### Slurmy Vvizy Stuff

I was able to use the slurm config and munge key on the existing cluster, as well as the built slurm rpms, to add another login node in with the same configuration as the first login node, just without being a slurm controller.
It shouldn’t really be called a login node, as I disabled ssh access to it except for a dev account.
It’s really just an http access point to the vviz scripts.
I was also able to get my api running on this node, and Alex was able to get his api running as a service so that it didn’t need to be run as a user.
It was very simple to add the APIs onto the node, as they could be configured to use any path for the vviz scripts and outputs.
This means that the gateway node could sit completely separate from the rest of the cluster, including the vviz scripts, but still run the jobs.
The entire api could be packaged into a vm or container that sits entirely separate from the rest of the cluster.

I also had a look at other slurm config options that could be relevant.

‘SchedulerType’ determines how slurm schedules jobs.
By default, it comes with builtin and backfill, which both deal with priority slightly differently.
In theory, it would be possible to write a custom scheduler in c that would deal with ensuring that there are sufficient resources before scheduling a job at a certain time, but this would conflict with the normal usage of slurm on the other partitions.
A custom scheduler could run different logic for the normal partitions as well as the vviz partitions, however.
This does raise the question of if the vviz nodes and normal compute nodes even have to be within the same logical cluster, as the scheduling requires that the nodes hosting the vviz sessions are only used for that and nothing else.

‘PreemptMode’

##### Partition Config

For this type of setup, where the api is acting as the only route to run the vviz jobs, I think the partitions should be configured as follows.

Nodes that run vviz jobs should be in their own partition with a distinct name.
This will make it both easier to get specifically vviz jobs from slurm, as well as making it possible to configure the partition specifically for those jobs.

If specific nodes need to be configured to only allow certain users to run jobs on them, this should be done at the node level, and not with another partition.
This is to ensure that all vviz jobs are run on the same partition.
Restrictions like this can be applied to ranges of nodes, same as assigning partitions to them.

The vviz partition should be configured to only allow submissions from the gateway node using the ‘AllocNodes=’ config option on the partition.

One of the main parts of config that is needed is a controller user that has root access that a typical user can’t connect to.
This is so this user can run the slurm jobs as any user while still managing the permissions of all the files.

Another bit of config that is needed is that the flavours need to be accessible by a standard user.
I solved this by putting the flavour scripts in /etc, but it would probably make more sense to put them in /usr/share/vviz or something similar, as they can be edited, and new ones can be added.

##### FiFo Slurm Configuration

Doing some research into different slurm configurations has shown me that there might be a way to configure slurm to use a First in / First out configuration for queuing, which, combined with preemption, would mean that jobs that were scheduled earlier would always have priority over those scheduled later, meaning that they could be queued without worry of an earlier job pushing it back.

![Preemption Config](./extras/api/preemptConfig.png)

One key part of this is that this is a cluster-wide configuration, meaning that a custom priority plugin would have to be made that handles priority one way for most partitions, but does it a different way for the vviz partition.

## Monitoring

This week I spent fixing my API and altering my website so it works a bit better.
I also started making like a doctor cli which could try to diagnose issues with vvizes if there was one.
So you would run the command ./bin/dev.js doc vviz1 and it would check the viz is in the squeue and that you can ssh into the node.
Then it would make sure you can get an ip address of that vm and some other stuff that you should be able to get with the vm.

In terms of the fixes for the site I made it more usable and less laggy with the radar.
Also, I noticed that the site wasn’t showing the full history just some so I fixed that issue it was just a frontend issue.

## CLI

For this week I was focusing on the CLI integration tools for the VVIZ to make setting up new vviz units easier, as well as providing for a linking tool for all of the other projects.
This has been constructed in Ruby and is designed to work on the login node.
It is able to read the current cluster state, and run slurm commands from a simple cluster based system as seen by the command list here allowing for creation, deletion and monitoring of VVIZ nodes as required.
Every single command here contains an output reporting in json format as needed to allow for API integration.

### How it reads cluster state

- squeue --me and the %k comment JSON that bin/launch.sh writes per job — this is the primary data source: flavour, OS, seasonings, gui, status all come from the comment, with ownership guarded by --me (plus a job-name prefix fallback that catches PENDING jobs, which have no comment yet).
- The flavour catalogue: the sbatch flavour scripts in /opt/vviz/flavours (parsed for cpus/memory/partition exactly as the API does), etc/os.allowed and etc/seasonings.json.
- The per-job connection-info JSON launch.sh writes to /opt/vviz/run/output/ — connect relays the ssh/vnc commands it already contains rather than re-deriving them, so launch-script changes need no CLI change.

In action (creating a new vviz, checking status, connecting, and killing).
VVIZ create requires the flavour, then status can be used to track where the current role is.

Connect gives you the command action, not actually running the connect.

Killing ends the process
