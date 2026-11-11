# Week 5

## API

### FiFo Slurm Configuration

Having done some further research into this type of configuration, we have learned that it doesn’t do what we expected it to do, and would need the external controller to be attached anyway in order for this to work.
Because of this, we think it makes sense to let the api handle everything to do with timetabling and reservations, and just let slurm manage the resource allocation.
This means that the standard configurations for slurm can be used, without having to make any custom slurm plugins.
Slurm isn’t designed for this type of timetabling, so it doesn’t make sense to try and force it to.
The best course of action is just to restrict what applications can submit vviz jobs, and let those applications handle the scheduling.

## What we learnt

The slurm REST api vs running slurm commands directly was one of the first decisions, and the commands won out as the REST api isn't installed by default on slurm so there may be clusters without it, and mimicking the logged in user through it gets complicated.
That does mean a fair amount of parsing though as slurm's output is written for humans rather than computers, and it also means being very restrictive with what commands the api can run, as an RCE exploit would be very dangerous on anything web facing attached to a HPC.
The timetabling went the same way, with slurm not being designed for that type of scheduling, so the api owns the timetabling and reservations and slurm is left to plain resource allocation on its standard configuration, rather than forcing it with custom scheduler plugins.

Putting everything somewhere machine readable made the rest a lot easier.
With the job attributes in the slurm job comments, the os and seasoning lists as json instead of txt and the connection information written out at cloud init, nothing had to scrape slurm output to work out what a vviz is, and the api, the frontend and the cli all read from the same places.
That's also why every cli command outputs json, so the other projects can consume it.

On auth, PAM against the linux accounts with a JWT in a http only cookie worked well, and generating the signing secret on boot and keeping it in memory means it can't be stolen out of a file, and rotating it is just a restart.
The web terminal went through a couple of approaches, first generating a key pair per connection and appending the public key to authorized_keys, then swapping that for a certificate expiring after 30 seconds signed against a key already registered on the system, so there's no risk of the keys file filling up with temporary keys or getting corrupted from all the reads and writes.

The vviz scripts showed how much linux distributions differ as they all use different syntax for installing software, so a seasoning has to be made to work across every os, and openfoam ended up going through apptainer since a lot of distributions simply had no packages for it.
Merging everything into the one prolog.sh file also showed how much easier a single central file is to work with than the same logic spread across multiple.

For gpus, splitting them through slurm gres sharding made more sense than MIG, vGPU Manager or SR-IOV, as gres sharding can be done with any gpu and a vviz can ask for however many shards it needs, where those are limited to particular gpus or need licensed software.

The monitoring agent turned out to be solving a problem that was never a problem, as everything we needed was already available from libvirt on the login node, so one script sshing into the nodes every 20 seconds and storing it in a database, with a read only api on top, covers it.
Though if we ever do need an agent, go would be the better choice over typescript, given how much smaller it ran and that it deploys as a single executable.

On the frontend, experimenting with AWS showed that a busy UI with no clear user flow is a real pain point, so keeping things clean and minimal is worth the effort.
Starting from a backend skeleton to begin with also beats tidying up a first attempt afterwards, which is what the api skeleton is there for.
