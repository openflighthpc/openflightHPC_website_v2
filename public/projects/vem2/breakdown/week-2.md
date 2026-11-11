# Week 2

## VVIZ Scripts

In week 2 I continued to focus further on the core scripts.
I fixed the scripts to properly kill and bring back up the vviz's, this means that all files kept in the vviz’s root directory are lost when the vviz stops.

My main focus this week was to expand the options available on the vviz's, my main way of doing this was through seasonings, these are software packages that the user can specify they want the vm to be installed with.
For example you can specify that you want the vviz to have the blender seasoning and on the state changing to ready the vviz will be fully functional with blender installed.
Alongside seasonings I also implemented multiple operating systems on the vviz’s this week this means that the users have a high amount of flexibility in terms of what options they can have on their vviz.
A major problem I ran into when implementing seasonings alongside the multiple operating systems options was the fact that different operating systems use different syntax for installation of software.

These options combined lead to difficulties making the seasonings work, something I have learnt this week is that the installation process can vary largely depending on the distribution of linux the vviz is running.
In particular openfoam was a seasoning that was difficult to make work as a lot of distributions weren’t able to install it easily, alma10 in particular simply had no packages for it available.
This led to the usage of apptainer to install openfoam and after a lot of trial and error all operating systems tested to date have been able to support openfoam running on them.

Furthermore I have implemented vnc connections to vviz nodes this week and gui options allowing for multiple ways to access a vviz node, the gui is optional making the vviz nodes more flexible and better able to meet different user requirements.
Due to the vviz nodes being only on the internal network currently and using the login node as a router in order to make vnc connections work an ssh tunnel has to be established which prevents vnc connections in their current state from being implemented into web frontends.

After requests by Oscar the attributes of a vviz are now stored in the comments of the job in json format making it easier for an API to parse making development of web APIs easier.

![Job Comment Example](./extras/vvizScripts/commentExample.webp)

This week I have also started to merge files into the prolog.sh file cutting down on the amount of files the vviz core scripts have, it should also make it easier to work with as it will centralise all of the generate and setup vm logic into one central file rather than being spread out across multiple.
Next week on merging files into the prolog.sh will continue into the following week as well as expanding the amount of seasonings available, research into passing gpus into vviz nodes and general changes to make the system more user friendly for example by placing the vnc connection information into the home directory of the user that creating the vviz rather than just outputting it into a slurm.out as is done currently.

Below is screenshots of the current list of seasonings implemented, OS’s supported and a vviz running a gui:

![Allowed Seasonings](./extras/vvizScripts/allowedSeasoning.webp)
![Allowed OSs](./extras/vvizScripts/allowedOs.webp)
![Vviz Desktop](./extras/vvizScripts/desktop.webp)

## API

In Week 2 I focused on adding user authentication into the API using PAM to validate the users login credentials against the linux system then once the user has been authenticated providing the user with a JWT token stored in HTTP only cookies which is then used to authenticate the rest of the users API request without the frontend handling the JWT token.

I went for this approach as it offers the best protection for users accounts helping to prevent cookies from being manipulated on the frontend, I also made it so the secret for the JWT tokens is generated on boot of the API and stored in memory to help prevent the secret from being stolen and used to read and sign new JWT tokens, this also allows for the secret to be rotated by just restarting the API.

The validation for the JWT tokens was added as middleware so it automatically gets implemented onto new API endpoints unless they are specifically specified as endpoints that do not need authentications, with this I also implemented a CSRF middleware to help protect the API more.

I also implemented rate limiting and timeout on the login endpoint to help prevent people from spamming the endpoint and overwhelming the PAM authentication system.

With the authentication implemented I also implemented user mimicking so once a user is logged in all jobs are then submitted by their linux user account and then can only be cancelled by their account.
I also implemented the web terminal into my API with authentication so when SSH through the API the user is logged into the terminal as their linux account.

In week 3 I want to focus on improving the API alongside the frontend to make sure it's able to do everything the frontend needs as well as look into build a CLI tool that can interact with the API as well as look into the web terminal and investigate a better way to handle the keys instead of generating new ones every connection.

### Continuing

#### Oscar

Building off of the api I made last week, I decided to go more in depth into the idea of resource management on the clusters, and the idea of booking a slot.

##### Portions

One of the things I was experimenting with was the idea of breaking up the nodes into “portions” that were an abstraction of computing resources.
The idea behind it being that you would be able to see how much “space” was available on a node now and in the near future at a glance, to make it easier to determine if a vviz flavour could fit in a node at a certain time.
The idea of scheduling would also have fit into this with “portions” being the units of compute power that determine if a vviz could be scheduled.

Visually it would have looked like this:

![Portions](./extras/api/portions.webp)

Where you can easily see how much space is being taken up.
This could also be given a time axis to show how much space is being taken up for a given time, showing users where they might be able to schedule their vvizes.

The main problem with this approach is that there is no real correlation between how many cores a user might want for their vviz with how much memory they need.
One flavour of vviz might only require one core and lots of memory, whereas a more processing heavy flavour might need more cores.
This means that two vvizes, each taking up 8 “portions” could combine to only take up 10 “portions” of cluster space.
The solution to this would either be to standardise the ratio of cores to memory in all flavours, which takes away from the idea that different users need different things, or to accept that a lot of cluster resources would be unusable.
Abstracting computing power into a single scalar was always going to waste some resources like this, but I think that this is too much.

I removed all the references to portions, and instead replaced them with a less abstracted, but more intuitive method for getting this information, by just having the vvizes and nodes return the actual values for their resource amount.

![Resource Values](./extras/api/resourceValues.webp)

##### Scheduling

The next thing I decided to try was using the api as a way to add scheduling information into the slurm commands that ran the vvizes.
This would involve stripping away some of the scheduling responsibility from slurm, and instead managing at the API level instead.
Slurm supports an option for “--begin” which tells slurm when to start trying to run the job, as well as a “--time” flag that tells slurm how long the job can run for, so I was able to submit vviz jobs that would run within a set window.
The “--begin” option only determines when slurm will start trying to run that job, not actually when it will start.
This means that the API will have to ensure that jobs end when they are supposed to, and that a job scheduled earlier can’t push an already scheduled job later.

###### Slurm’s Reservation System

Slurm does actually include a reservation system that allows users to reserve a certain number of cores, or even a full node, and then submit that job to the reservation.
There are a few issues with this, however.
Firstly, while you can reserve cores, you can’t reserve memory, so resource reservation might fall apart with few high-memory vvizes running.
Also, while reservations can manage start times, if a vviz is running and the reservation ends, the vviz won’t stop.
Reservations are also more complex to work with, as getting information about a vviz won’t necessarily get information about the reservation it’s in, requiring an additional information request to get the info about the reservation.
Reservations can also have multiple jobs assigned to them, which is just more complexity.
As both memory and end times would have to be managed by the api, adding in the extra layer of dealing with slurm reservations just seems like additional, unneeded complexity.
Managing core allocations also isn’t that complex, and can be handled in the same way as memory.

###### Manual Scheduling

Slurm itself stores the information about the start and run times of jobs, even if they aren’t running yet, and the resource information could be retrieved from the flavours.
Because of this, I was able to return resource usage over time from the GET /vviz endpoint, and format it like this.

![Resource Usage Over Time](./extras/api/resourceOverTime.webp)

After this, I made the api calculate if a job would be able to run when submitted based on how many resources are available at that time.
If it couldn’t, rather than let slurm schedule it after, I decided to make it return a conflict error.
I decided to make the api be the arbiter of when things run, as it makes predicting when jobs can run that much easier.
I also made an endpoint that will tell the user if a vviz will be able to run, and which nodes can take it.

I was able to represent this information like this:

![Cluster Impact](./extras/api/clusterImpact.webp)

Overall, manual scheduling works well.
The main issue with it is that all the jobs need to be submitted through the api, as otherwise, jobs could skip the validation process, and push other jobs later in the queue.
The viability of this approach will depend on if the api is the only access point to creating the vvizes, or if there will be other ways that do not adhere to the scheduling.

##### Next Steps

There is some more scheduling logic I’d like to try and create.
At the moment, the user has to look at the graphs of resource usage and decide for themselves when they would like to book the vviz for.
One thing that could be useful is a way of asking the api to schedule the vviz itself.
Users could provide restrictions about when they want it, and maybe even provide a range of flavours to use with different priorities so the api could return which flavours could fit at the requested times.
Getting flavours could also show when the flavour can next be requested, on which node, and for how long.

I also want to experiment with taking the scheduling logic out of the api.
The idea here is that if other methods of interacting with the vviz scripts is required, then users wouldn’t have to go through the api in order to use the scheduling functionality.
Other systems, such as a cli tool or a TUI, could then interact with it, and keep the same scheduling logic.

![Interface Scripts](./extras/api/interfaceScripts.webp)

## Frontend

This week I worked on improving the web terminal experience.
I was particularly interested in how AWS and other cloud providers allow access to web terminals for their users through the browser.
After some research and discussions with Alex, a solution came to us of having an API, which ran on the cluster, generate an SSH key pair, append the public key to the authorized_keys file in the .ssh folder, and then used the private key to create a connection from the server to the user via a websocket.
The private key would not be sent to the browser or saved to disk but would just exist temporarily in memory and then be discarded.
I created an API with a get /terminal request that opened up a websocket and this approach worked.
After this, Alex incorporated this into his own API and improved it by making it work for different users and jumping into the hostname.

I also worked on adding more information to the users about what they would like in their virtual computer.
This included choices on operating systems, software packages and time duration.
Using Oscar’s API I was also able to let the user know when their job was expected to run and made more UI/UX improvements to the web portal.

I also added authentication gates on the frontend to allow the website to be compatible with Alex’s API.

Aside from this, I improved the look of the website by creating a starry galaxy sky with a moose-antlers constellation to reinforce the Alces brand.
In week 3 I am focusing on getting the portal ready for a comprehensive demo and improving the UI as and where necessary.
I am also adding in additional features to fully demonstrate the APIs that have been created for this project.

## Monitoring

After the first week of R&D I realised that making a monitoring agent on each vviz would be relatively redundant due to being able to find all the information I needed using libvirt commands on the login node.
So I decided to make a monitoring script which runs every 20 seconds and stores the information in a database.
This database stores information such as the jobId cpu percentage used memory percentage and memory used in GB.
Also stores the slurm job id vm name node and the vcpus.

The process is to first get the vviz jobs running to work out which nodes they are on.
Then depending on what nodes they are on it will ssh into those nodes and get info about the vviz jobs on that node and so on.
Then once it has all finished it will wait 20 seconds then start again below is an example of the information it collects.

![Monitoring Response](./extras/monitoring/monitoringResponse.webp)

I put the database onto a vm and am currently storing the data from the monitoring script.
I then decided to start working on an api which can interact with the database which is what I started building the end of week 2 and am still finishing it up now in week 3.
