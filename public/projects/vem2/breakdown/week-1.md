# Week 1

## VVIZ Scripts

From the scope I chose to work on and continue to refine the core VVIZ scripts that the API relies upon, one of the concerns brought up during the week was that jobs were being scheduled on the vviz’s on slurm instead of the compute nodes themselves which is an inaccurate representation of how the system works.

Much of my week was spent solving issues with the core scripts which revealed themselves during usage, one of these was a major flaw in the fstab file in the virtual machines which caused the machines to start up again without an ip address which caused a major failure as it was unable to connect to the shared nfs drive and wasn’t able to ssh to the other nodes making them inaccessible and causing the job to fail.

I was able to add some features to the VVIZ scripts during the week with the addition of the newNode.sh script, this allowed for new viz node slots to be easily added with the files being edited programmatically as well as the viz nodes being configured with slurm and connecting to the nfs mount programmatically.
Furthermore the ability to delete viz node slots was added to the newNode.sh script.
Finally I created a setup script for the VVIZ core scripts however it has not been tested yet.

I have learnt more about programmatically changing existing files using bash, as the newNode.sh script is reliant upon this particularly for changing the amount of licenses in the slurm.conf file as this number needs to go up and down as viz node slots are added and removed.
I also learnt about and solved the issues with vviz that emerged as more people used it, namely the issues with how fstab was set up as well as issues with the vviz scripts themselves.

This coming week I will be continuing to work on the vviz core scripts, I plan on actually killing the virtual machines and then reconfiguring them instead of the stop, reconfigure and then start system we currently have.
Actually killing them will result in all files on the virtual machine being lost once the user's vviz session is up matching the intended behaviour.
Furthermore I also plan to integrate a seasoning option into the core scripts allowing users to ask for specific “seasonings” which would result in the vviz coming with requested software on start.
Finally I plan on implementing an absolute endtime for vviz jobs so instead of saying I want the job to last x hours you can specify I want the job to end at x time.

Below is the successful output of the newNode.sh script adding a slot for viz7:

![New Vviz 1](./extras/vvizScripts/newVviz1.png)
![New Vviz 2](./extras/vvizScripts/newVviz2.png)
![New Vviz 3](./extras/vvizScripts/newVviz3.png)

## API

We set out to make an api that could interact with slurm in order to determine what vizes were running on a cluster.
The idea was a proof of concept for an api that could sit on the login node, in order to run slurm commands to manage what vizes were running.

We used the hono template that we already had, and found that it was possible to directly run slurm commands via node, and output the data as json.
We did find that you had to be very restrictive with what commands can be run, as an RCE exploit could be very dangerous on a web interface attached to a HPC.

![vviz response](./extras/api/getVvizResponse.png)

After that, we made a delete endpoint that would run the scancel process on that id.
To do that, we found that scancel and squeue will return stderr if you give it a job id that didn’t exist, so we had to make a method that would ensure that the job existed, and was a viz job before cancelling it.

We were able to use the fact that the genders are just sbatch scripts to create an endpoint that lists the available flavours.
Also by reading the content of those scripts, we was able to get information about them such as their core count and memory.

![flavours response](./extras/api/getFlavoursResponse.png)

Finally, using the flavour names, we could make an endpoint that created a vviz.

![create vviz response](./extras/api/createVvizResponse.png)

Using slurm commands as the data layer proved to be a bit challenging, as the outputs are optimised for human readability and not for computers.

We found that there is a package to give slurm a REST api, and that would be a much better way of interacting with slurm as it can include the safeguards and doesn’t involve running bash commands directly.
The issue with it is that it isn’t installed by default on slurm, so there may be clusters without the api.
We believe that the best way to implement this would be to have a layer of abstraction between the data layer, which could be either direct slurm commands or the slurm REST api, and the rest of the api.
This way, the api can run on any slurm installation, and can be configured to use whichever is more convenient.

While working with the slurm REST api though we realised that it would be better to interact with slurm through the commands to help reduce the need for additional software to be installed when setting up the API.
It would also help further down the line with development as when we implement logging into the user accounts we will need to be able to mimic the user and run commands which gets complicated through the slurm REST api so it is better to focus on developing the commands variant.

### Continuing

#### Oscar

I am going to do some experimentation on an idea I had to book out slots so that users can be sure of when their vviz session is starting.
The idea for this can be seen here:

When the user creates a VVIZ, they can specify times that they would not like to be booked out, e.g. night, lectures/labs, other commitments, etc, along with their flavour.
The system would then use the start time and time limits of existing and queued jobs in order to find the next available slot that would fit the specifications of the user, and then the job could be queued, with the job id returned to the user so they could keep track of its status.
Jobs would be run internally with slurm with the --begin flag so that they won’t run too early.

If a vviz session was cancelled early, other vviz sessions would not be reorganised to account for this gap, the slot would be made available for booking by other people.
This is because if a user has been told that they have the machine from a certain time, they will schedule things around it and it wouldn’t make sense for it to start early.

This information could be visualised like this in order to show how much resources are available:

![timetable](./extras/api/timetable.png)

Pros:

- Users would know exactly when their vviz sessions would be
- Users would be able to specify when they don’t want their sessions
- Users would be able to easily see when their job could run through visualisations
  Cons:

- This seems like trying to turn slurm into a more traditional booking scheduler rather than what it was designed to do: get as many jobs running as soon as possible.
- It wouldn’t integrate well with the regular usage of slurm, as slurm will make earlier jobs take priority, and not respect the begin time of existing jobs. The system would have to be configured to use slurm’s reservation system. This would make it difficult to run jobs where you don’t know how long they will run for, so clusters may have to be partitioned to allow for these sorts of jobs.

#### Alex

I am going onto authentication using PAM to interact with the linux user system and combining it with JWT token to lock the API behind needing to be logged into a linux account which is on the slurm cluster and so that jobs can be started as the logged in user so only they can control and access their jobs.

## Frontend

This week our task was to explore creating virtual machines for users that would double as their own personal login node where they can run jobs.
I wanted to explore a web UI that would help guide users to create their own personal virtual computer on a cluster.
The frontend used Alex and Oscar’s API to view flavours, create instances and track the status of those instances.
After experimenting with the frontend for AWS, a clear pain point was a lack of user flow and a very noisy UI.
I therefore decided to create a UI that was clean, minimal and straightforward for a user that would hopefully minimise any future pain points they would have when interacting with the site.

I named the site AlcesNova, or New Moose, as I wanted a modern, technical sounding name without down selling the project.
The landing page features a supernova-inspired design with the project name and clear guidance of what it does.
It also features an infinite marquee with the software packages that would come preinstalled with launching the computer.
(This needs some revising as unsure whether the VM inherits all the software from the compute node it is hosted on, or whether a user would have to install all desired software packages themselves.)
This was added to increase transparency for the user, answering questions regarding whether the virtual machines would have the software they needed.

![Homepage 1](./extras/frontend/homepage.png)

The flow is log in → select a flavour → create instance → track status → if running, provide instructions for connection to their machine.
The connection options included a web terminal which was achieved through running a separate backend and opening up a websocket where the client could SSH in and see the terminal in real time.
This was more a demonstration of possible features of a production build and more research has to be done to ensure if this can be done securely when in production.

Next week I am going to work on displaying more information for the user when selecting a flavour, specifically I aim to tell them how long they can expect to wait for their virtual computer to launch depending on what flavour they select.
I will also look at improving the web terminal experience and ensuring it is safe and secure.

## Monitoring

In the first week of R&D I made a vviz monitoring system for individual instances of a vm.
This gathered cpu utilisation, memory utilisation, network activity, ssh sessions and vscode activity.
This could also detect how many people sshed into the vm using vscode and tell the difference between that and a normal terminal ssh in.

The idea was if someone wasn’t using the vm the vm could go into a hibernation state and potentially lend the resources back to the rest of the cluster.

I built this agent originally in typescript and it found the information mentioned in the first paragraph and printed the results in json every ten seconds initially.

I realised a few days into development I was solving a problem that was never a problem.
We don’t necessarily need to see how much individual vviz vms are doing through an agent on each vm, it would be better if we had something on the cluster which monitors it all rather than having something on each vm which collects a lot of information parts of which are unnecessary.

As I already built the monitoring agent I thought I would get AI to rebuild the agent in go and see how it compares as in the future in a different/another project I may need to make something that runs as a monitoring agent and I was not sure if typescript would be the best one to use in that scenario
Below is a table of my findings of comparing the Go agent to the TypeScript agent.

| Metric       | TypeScript/Node.js | Go                         |
| ------------ | ------------------ | -------------------------- |
| RSS memory   | ~60.4 MiB          | ~10.9 MiB                  |
| PSS memory   | ~26.6 MiB          | ~9.5 MiB                   |
| CPU overhead | Higher             | ~6.5–6.7× lower CPU time   |
| Deployment   | Requires Node.js   | Single compiled executable |

### Conclusion

It is possible to somewhat monitor an individual on a vviz vm, however its pretty much redundant when all the information is accessible from libvirt, getting rid of the need for a monitoring agent on every vm.
However, I do think if I am to make a monitoring agent of some kind that is on a lot of vms or nodes or something, it may be worth looking into a go solution rather than typescript due to it being so much smaller than a typescript solution
Also without doing this research I wouldn’t be able to confidently say that its not worth having a monitoring agent on each vm but I can say that now
The information you can gather on a vm is more but not much more and it's relatively redundant information
Below are URL’s to the monitoring agents I made. I also have more detailed notes I have saved locally under my VVIZ folder in my notes on Obsidian locally.

[go agent](https://gitlab.dmz.alces.network/a04b04/go_vviz_agent)

[typescript agent](https://gitlab.dmz.alces.network/a04b04/ts_vviz_agent)

Below is example of data of what both agents would give out:

![Raw Monitoring Response](./extras/monitoring/rawMonitoringResponse.png)