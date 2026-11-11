# Week 3

## VVIZ Scripts

In week 3 further improvements were made to the core scripts, files relating to bringing the vviz’s up have been successfully merged into the prolog.sh file making overall maintenance and alterations to the start up process significantly easier.
Furthermore significant changes were made to the system to make it more easily parseable by the API, namely changing the os.allowed and seasonings.allowed files to JSON files.
This has allowed categorisation to be implemented into seasonings and families to be implemented into os’s allowing for easier expandability in the future on both the seasonings and JSON side.

Further improvements in week 3 included an output of a JSON file with all the information about a vviz when the vviz has finished it’s cloud init process, the JSON file contains: the job id, when it ends, the cancel command, the name of the vm, the hostname, the ip, the flavour, the os image, the hypervisor, the user, the user’s home directory, ssh information and VNC connection information.
All of this is provided to make it as easy as possible for API’s to get information about the vviz’s, the sbatch command also now takes in the users password as an argument as we also create the user who ran the sbatch command on the vviz so passing their password through makes this as seamless as possible to the user.

![Vviz JSON Output](./extras/vvizScripts/vvizJsonOutput.webp)

Significantly more seasonings were added to the system this week across several categories, several text editors were added, podman and docker were added, basic utilities like firefox, a pdf viewer and the libreoffice suite were included as well as developer tools like Jupyter and general build tools and scientific tools like Avogadro and IGV.

Research into how to pass GPUs into vviz nodes has revealed several results, given our current system it seems possible to pass GPUs in several different ways.
We can pass GPUs directly with a whole GPU going to one viz node via our vm creation scripts, we can also use Nvidia MIG and Nvidia vGPU Manager to split one gpu into multiple and then pass one of these slices into a vviz however this has disadvantages namely that Nvidia MIG only works on some Nvidia GPUs, furthermore Nvidia vGPU manager is required to properly split the GPUs and is licensed software.
Another approach to splitting one GPU into multiple is by making use of SR-IOV (Single Root I/O Virtualisation) this allows one PCIE device to appear as multiple giving multiple virtual machines access to the same hardware however a lot of GPUs do not support SR-IOV and SR-IOV with virt-install is incredibly prone to configuration errors.
Therefore the best way to share GPUs between multiple vviz nodes that we have found is to use slurm scheduling to share the resource and make use of gres sharding which would allow for multiple vviz jobs to share one gpu and would allow us to ask for however many shards of the gpu the vviz needs while the other approaches would mean assigning what the vviz vm would see as multiple GPUs if we needed more than one MIG/SR-IOV slice, furthermore it seems that gres sharding can be done with any GPU while MIG and SR-IOV are limited in the GPUs they can run on so in our opinion the best way to tackle splitting a GPU across multiple vviz nodes would be to make use of slurm and gres sharding.

Going into week 4 we plan to continue to develop the scripts into a fully fledged product, a main goal for the coming week is to make the scripts easier to setup and install as currently it is not documented very well and could be automated via a setup script, furthermore a basic management interface could be created as currently adding or removing vviz slots is performed through a script as well as continuing to add features and format changes request by people working on API’s to make it as easy to get information from the core scripts about the state of the vviz’s as possible.

## API

In Week 3 we worked on switching the web terminal from creating and storing SSH keys in the users authorised keys file to using a temporary certificate system instead which would then expire after 30 seconds to prevent the certificate from being used again.
This method also adds the benefit of not needing to be added to the users authorised keys as the certificate is created against a key that's already registered against the whole system this is good as it means there doesn't have to be lots of read and writes to a file preventing the issue of it becoming corrupted or overfilled with temporary keys.

We also worked on updating the API to implement filtering to some of the get endpoints, making it so it can read the new JSON files instead of the old txt files and making it so it can retrieve the new information about VNC connections into the VVIZ.

We also then worked on building a CLI tool for the cluster which allowed the users to login to the API and interact with the API to create, view and manage their VVIZes we built this using a system to store the users cookies into a session file which is stored in their home directory this allows them to stay logged in over multiple days.

Going into week 4 we will be working on adding more features to the CLI and improving its implementation, as well as keeping the API up to date with new changes and features being added to the VVIZ handler.

### Continuing

#### Removing the Scheduling Logic out of the API

We didn’t get very far into removing the scheduling logic before realising that it wouldn’t be as helpful as we thought it would be.
What this would be, is a service that runs somewhere on the same network as the cluster, that could run slurm commands and find things out about the state of the vviz nodes.
This describes the api we’ve made.
The only benefits we could find for making it a separate service is that it could be written in a more efficient language, like rust or go, and run as a daemon, meaning that any service could easily interact with it, without having to worry about the speed of network requests.
That is a minor issue in the grand scheme of things, however, so we felt our time would be better suited to other experiments.

#### Scheduling Improvements

The next thing we wanted to try was making some improvements to how scheduling was done.
One thing that was said at the start of making the scheduling api, was that the user could set a blacklist or whitelist for times that they would be ok with, and then they could be assigned the next available vviz that fit those conditions.
We originally thought that this would be something that would be done in a separate service, like a frontend, but we thought that it would make sense to move this logic to the backend, so that any service could use it.
We created two endpoints to this end.

Firstly, we created an endpoint to see if a vviz would fit in a given time.
This just used the already existing logic we had that would throw an error if a posted vviz wouldn’t fit in order to return what nodes the vviz could run on.

![Fit In Time](./extras/api/fitInTime.webp)

Secondly we created an endpoint that would get the next time that a vvizes with a specified config would be able to run.
The way we made it was inefficient, as it had to check each spot where a vviz could be slotted in and see if it would actually fit.
This involved getting all the scheduled vvizes, and seeing if a new vviz could be put in after it.
This proved that the concept worked, but even with small amounts of vvizes, the response times were exceeding 100ms, and we are sure that there is a more efficient way of doing this.
This could do with some further experimentation.

#### Updating a VVIZ

One other idea we had while testing the visualiser was that as slurm could update the time limit of existing jobs, users could patch vvizes to increase or decrease the length of their vviz.
This could also be useful to administrators if there is a priority vviz that needs to run, or another issue that requires resizing jobs.
One thing that we found while doing this, is that in slurm 26, users don’t have permission to edit the length of jobs, even their own one.
In a live system, this would have to be linked up with the account system so that the commands could be run as root after the proper authentication was done.
Apart from that, it was simple to add in a patch endpoint to the existing vvizes to allow users to change their size.

#### Other API Improvements

To keep up with the changes being made to the vviz scripts, and as we had some other ideas, we made some other changes and improvements to the api.
This included:

- The ability to sort by each of the fields when an user gets all vvizes
- Duplication checking on posting seasonings, as multiple of the same seasonings could be added to one vviz
- Custom output paths for the slurm messages so that they could be in a consistent place and not clogging up the home directory.
- Vnc connection info that was retrieved from a new file created by the vviz scripts

#### Slurmy Vvizy Stuff

One of the issues with this method of scheduling vvizes is that it relies on everyone creating the vvizes through the api, as someone could make a vviz with slurm and it would be put to the front of the queue, pushing all the queued vvizes back.
Users need to be able to submit jobs normally, but they also need to be able to submit vviz jobs only through the api.

We had the idea to make two login nodes, one normal one where users could submit jobs to the regular partition, and one restricted one, that didn’t have ssh access, and could only be connected to over http via the api.
This would mean that only the slurm jobs requested by the api could be run, and these would have to run through all the validation and queueing stuff.

To test this, we made a test cluster with the following specs:

|                   | login-01             | login-02             | node-01              | node-02              |
| ----------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| User              | dev                  | dev                  | dev                  | dev                  |
| OS                | alma10               | alma10               | alma10               | alma10               |
| Internal IP       | 10.0.0.200           | 10.0.0.201           | 10.0.0.202           | 10.0.0.203           |
| External IP       | 10.151.0.42          | 10.151.0.44          | 10.151.0.165         | 10.151.0.125         |
| Local Hostname    | login-01.testcluster | login-02.testcluster | node-01.testcluster  | node-02.testcluster  |
| Internal Hostname | login-01.testcluster | login-01.testcluster | login-01.testcluster | login-01.testcluster |
| Password          | (redacted)           | (redacted)           | (redacted)           | (redacted)           |
| Role              | login + mgmnt        | login                | compute              | compute              |
| Partition         | n/a                  | n/a                  | nodes                | vviz                 |

The openflight shared key is on the login node so it should be open to access.

![Split Partitions](./extras/api/splitPartitions.webp)

We were able to set the slurm partitions so that vviz would only accept jobs from login-02 and nodes would only accept jobs from login-01.

##### Next Steps

We want to do more configuration with the extra node to see if we can fully disconnect it from the other nodes to prevent ssh access to it except from an admin account.
We’d also like to see if we could put another login node on the test cluster that we’re using and run the api on that.

## Frontend

This week we were focusing on incorporating several new features of the api such as introducing software packages and separating both software and operating systems into categories.
The virtual nodes also support desktop sessions so that became an additional step in the setup wizard and also included an additional connection method.
Currently the virtual desktop connection simply opens a vnc connection with the username and password supplied by the api.
It connects to the virtual node through a proxy jump at the moment but this will change when each node has their own distinct IP address.

We are also happy with the current setup wizard for creating a virtual node after having added more software packages, breaking OS and software packages into categories and introducing configuring virtual desktop sessions.

The wizard steps:

1. Flavour

![Flavour Choice](./extras/frontend/flavourChoice.webp)

2. Operating system

![Operating System Choice](./extras/frontend/osChoice.webp)

3. Software packages

![Package Choice](./extras/frontend/packageChoice.webp)

4. Time limit

![Time Limit](./extras/frontend/timeLimit.webp)

5. Graphical User Interface

![Gui Config](./extras/frontend/guiConfig.webp)

We have also been further experimenting with the design of the site, creating the landing page to be a night scene in the desert with the Alces constellation in the night sky.

![Homepage 3](./extras/frontend/homepage3.webp)

This week we’re planning to finalise the frontend flow, ensuring consistent styling across the whole site.
We will also look at incorporating the timetable visualisation of available slots into the frontend.

## Monitoring

This week we decided to make an API using hono.
This api was going to be something that could interface the database that was put on a VM last week.
As the database is updated dependent on what vvizes are doing and how many there are, the api cannot alter what's in the database it is just used to get information out of the database.

It only has endpoints and an image for them is below.

![Monitoring Api Docs](./extras/monitoring/apiDoc.webp)

Initially we made the API how we would make it in university which isn’t the best practice.
So after we made the API we looked at the api skeleton then tried to reformat our api to match something similar to that.
This meant the code became much cleaner and in the future we will definitely just use that repo as a base then build off that.

The history endpoints show the full history of a specified viz by the slurmid, also the overview endpoint shows the average cpu percent memory percent and memory used within a specified time frame.

We’d say the majority of the time spent this week was looking at how the other API’s built during the project were put together and understanding why they did it that way.
We definitely feel more comfortable doing backend work from making this basic api using hono.
The API is currently on a vm and if you would like to have a look at the docs here is the link. http://10.151.0.109:8081/api/v1/docs#description/introduction

Also we spent the Friday messing around with a frontend solution while fixing up little bugs with the frontend.
The frontend was heavily AI as we wanted to focus more on the monitoring systems and other ideas.
We just wanted to spend a bit of time on a frontend so we could showcase the API a bit better.
Below are some screenshots.

![Monitoring Frontend Fleet](./extras/monitoring/genericTelemetry.webp)
![Monitoring Frontend Viz](./extras/monitoring/specificTelemetry.webp)

For the following week we were going to focus on fixing the site as it was heavily vibecoded there was a few bugs and then we're going to mess around with a viz cli tool which may be able to find more information about the vizes need to do some research as well, seeing if its worth us spending time doing.

## What we learnt

Finishing the merge into prolog.sh confirmed that a single central file makes changes to the startup process far easier to make, and moving os.allowed and seasonings.allowed to json with categories and families made both lists easier to expand and easier for the api to present.
The gpu research settled that slurm gres sharding is the most portable way to share a gpu, since MIG, vGPU Manager and SR-IOV are all tied to particular cards or licences, and swapping the web terminal's per connection keys for a 30 second certificate signed against a key already on the system removes any risk of authorised_keys filling up or corrupting.
The attempt to lift the scheduling logic out of the api turned out to be redundant, as the api already is that service, and the next available slot endpoint proved the concept even if checking every possible spot one by one pushed response times past 100ms.
It also turned out that slurm 26 doesn't let users edit the length of even their own jobs, and that the two login node test cluster proved vviz jobs can be made to come only through the api by limiting which nodes each partition accepts submissions from.
