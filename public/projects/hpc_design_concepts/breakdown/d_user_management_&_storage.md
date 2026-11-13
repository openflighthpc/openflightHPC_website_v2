# User Management

# User Authentication

User authentication is usually performed in a server/client setup inside the HPC environment due to the unnecessary overhead of manually maintaining `/etc/passwd` on a network of nodes. A few options for network user management are:

- NIS: NIS is a directory service that enables the sharing of user and host information across a network.
- FreeIPA: FreeIPA provides all the information that NIS does as well as providing application and service information to the network. Additionally, FreeIPA uses directory structure such that information can be logically stored in a tree-like structure. It also comes with a web interface for managing the solution.
- Connecting to an **externally-managed** user-authentication service (e.g. LDAP, active-directory). This option is not recommended, as a large HPC cluster can put considerable load on external services. Using external user-authentication also creates a dependency for your cluster on another service, complicating troubleshooting and potentially impacting service availability.

If the user accounts need to be consistent with accounts on the external network then the master node should have a replica service to the external networks account management system. This will allow the account information to be forwarded to the HPC network, without creating a hard-dependency on an external authentication service.

# User Access

It is also worth considering how users will be accessing the system. A few ways that users can be accessing and interacting with the HPC environment are:

- SSH: This is the most common form of access for both users and admins. SSH will provide terminal-based access and X forwarding capabilities to the user.
- VNC: The VNC service creates a desktop session that can be remotely connected to by a user, allowing them to run graphical applications inside the HPC network.
- VPN: A VPN will provide remote network access to the HPC environment. This can be especially useful when access to the network is required from outside of the external network. Once connected to the VPN service, SSH or VNC can be used as it usually would be.

If running firewall services within the environment (recommended) then be sure to allow access from the ports used by the selected user access protocols.

# Additional Considerations and Questions

- What information will need to be shared between the systems?
- How will users want to access the system?

:::page-break

# Storage

# Storage Hardware

When selecting the storage solution it is worth considering the size, performance and resilience of the desired storage solution. Usually some sort of storage array will be used; e.g. a collection of disks (otherwise known as JBOD) in the form of an internal or external RAID array.

# Type of filesystem

For many requirements, a simple NFS solution can provide sufficient performance and resiliency for data. Application, library and source-code files are often small enough to be stored on an appropriately sized NFS solution; such storage systems can even be grown over time using technologies like LVM and XFS as requirements increase.

For data-sets that require high capacity (>100TB) or high-performance (>1GB/sec) access, a parallel filesystem may be suitable to store data. Particularly well suited to larger files (e.g. at least 4MB per storage server), a parallel filesystem can provide additional features such as byte-range locking (the ability for multiple nodes to update sections of a large file simultaneously), and MPI-IO (the ability to control data read/written using MPI calls). Parallel filesystems work by aggregating performance and capacity from multiple servers and allowing clients (your cluster compute and login nodes) to mount the filesystem as a single mount-point. Common examples include:

- Lustre: an open-source kernel-based parallel filesystem for Linux.
- GPFS: a proprietary kernel-based parallel filesystem for Linux.
- BeeGFS: an open-source user-space parallel filesystem for Linux.

Your choice of filesystem will depend on the features you require, and your general familiarity with the technologies involved. As parallel filesystems do not perform well for smaller files, it is very common to deploy a parallel filesystem alongside a simple NFS-based storage solution.

If your data-set contains a large number of files which need to be kept and searchable for a long time (> 12-months) then an object storage system can also be considered. Accessed using client-agnostic protocols such as HTTPS, an object storage system is ideal for creating data archives which can include extended metadata to assist users to locate and organise their data. Most object storage systems include data redundancy options (e.g. multiple copies, object versioning and tiering), making them an excellent choice for long-term data storage. Examples of object-storage systems include:

- **AWS Simple Storage Service (S3):** a cloud-hosted service with a range of data persistence options.
- **Swift-stack:** available as both on-premise and cloud-hosted services, the SWIFT protocol is compatible with a wide range of software and services.
- **Ceph:** an on-premise object storage system with a range of interfaces (block, object, S3, POSIX file).

# Network Storage Solutions

### Single server with NFS

![Single Server NFS picture](./extras/SingleServerNFS.webp)

In this example, a single server is connected to a RAID 6 storage array which it is serving over NFS to the systems on the network. While simple in design and implementation, this design only provides redundancy at the RAID level.

### Mutiple Servers with NFS

![Multiple Servers with NFS picture](./extras/MultiServerNFS.webp)

In addition to the previous example, this setup features multiple storage servers which balance the load of serving the disk over NFS.

### Multiple Servers with Parallel filesystem

![Multiple Servers with Parallel filesystem picture](./extras/MultiServerLustre.webp)

This setup features multiple RAID sets which are installed externally to the storage servers and are connected to both of them using multipath - this allows for multiple paths to the storage devices to be utilised. Using this storage, a Lustre volume has been configured which consists of a combination of all the external disks. Authorisation of access to the storage volume is managed by the metadata node, which also has dedicated storage.

### Additional Considerations and Question

- What data will need to be centrally stored?
- Where will data be coming from?
   - Are source files created within the HPC network or do they exist in the external network?
   - Will compute nodes be writing out logs/results from running jobs?
   - Where else might data be coming from?
- Is scratch space needed?
- What level of redundancy/stability is required for the data?
- How will the data be backed up?
   - Will there be off-site backups?
   - Should a separate storage medium be used?
   - Does all the data need backing up or only certain files?
   - For how long will we keep the data, and any backups created?
- What are my disaster recovery and business continuity plans?
   - If the storage service fails, how will my users continue working?
   - How can I recreate the storage service if it fails?
   - How long will it take to restore any data from backups?

:::page-break

# Monitoring

# Types of Monitoring

There are 2 types of monitoring that can be implemented into a network; these are:

- **Passive:** Passive monitoring tools collect data and store from systems. Usually this data will be displayed in graphs and is accessible either through command-line or web interfaces. This sort of monitoring is useful for historical metrics and live monitoring of systems.
- **Active:** Active monitoring collects and checks metrics; it will then send out notifications if certain thresholds or conditions are met. This form of monitoring is beneficial for ensuring the health of systems; for example, email notifications can be sent out when systems start overheating or if a system is no longer responsive.

Both forms of monitoring are usually necessary in order to ensure that your HPC cluster is running properly, and in full working order.

# Metrics

It is worth considering what metrics for the system will be monitored; a few common ones are listed here:

- CPU
   - Load average
   - Idle percentage
   - Temperature
- Memory
   - Used
   - Free
   - Cached
- Disk
   - Free space
   - Used space
   - Swap (free/used/total)
   - Quotas (if configured)
- Network
   - Packets in
   - Packets out

Cloud service providers usually have both passive and active monitoring services available through their cloud management front-end.

# Additional Considerations and Questions

- What metrics should be monitored?
- How frequently should metrics be checked?
- What level of notification is required?
   - Escalation upon repeated errors?
   - Acknowledgement of long-running outages?
   - How do we avoid over-saturation of notifications during major outages?
   - What tests will we run to ensure notifications are working properly?

:::page-break

# HPC Environment

In a HPC environment there are large, distributed, multiple processor jobs that the users wish to run. While these jobs can be run manually by simply executing job scripts along with a hostfile containing the compute nodes to execute on, you will soon run into problems with multiple users, job queuing and priorities. These features are provided by a job scheduler, delivering a centralised server that manages the distribution, prioritisation and execution of job scripts from multiple users in the HPC network.

Popular job schedulers for HPC clusters include:

- Open Grid Scheduler (SGE)
- PBS/Torque-Maui/ Torque-Moab / PBSPro
- SLURM
- LSF/OpenLava

All job schedulers provide a similar level of functionality and customisations so it is worth investigating the features of the available solutions to find the one best suited for your environment.

Traditional job schedulers are not the only solution, in some modern HPC environments resources can be managed using container frameworks, such as, [Kubernetes](https://kubernetes.io/)

# Application Deployment

General management of applications and libraries is mentioned in the [repository management docs](https://openflighthpc.org/lab/D3S1GN/docs/base-system/#repository-management) however this section focuses on installing applications into the entire HPC environment instead of individually to each node system.

A few things to consider when designing/implementing an application deployment system are:

- How will applications be stored? (central network storage location?)
- What parts of the application need to be seen by the nodes? (application data? program files? libraries?)
- How will multiple versions of the same application be installed, and how will users choose between them?
- How will dependencies be managed? (more on this below)

An application deployment system can be created yourself or but it's recommended to use an existing solution that provides tools and an index of HPC applications for HPC platform installations (such as Conda, EasyBuild or Spack).

# Dependencies

When it comes to managing dependencies for applications it can either be done with local installations of libraries/packages or by storing these in a centralised location (as suggested with the applications themselves). Dependency control is one of the main reasons that using the same OS for all systems is recommended as it eliminates the risk of applications only working on some systems within the HPC environment.

Dependencies must be managed across all nodes of the cluster, and over time as the system is managed. For example, an application that requires a particular C++ library that is available from your Linux distribution may not work properly after you install distribution updates on your compute nodes. Dependencies for applications that utilise dynamic libraries (i.e. loaded at runtime, rather than compile-time) must be particularly carefully managed over time.

# Reproducibility

It is important that your users receive a consistent, long-term service from your HPC cluster to allow them to rely on results from applications run at different points in your clusters' life cycle. Consider the following questions when designing your application management system:

- How can I install new applications quickly and easily for users?
- What test plans have I created to ensure that applications run in the same way across all cluster nodes?
- How can I ensure that applications run normally as nodes are re-installed, or new nodes are added to the cluster?
- How can I test that applications are working properly after an operating system upgrade or update?
- How will I prepare for moving to a new HPC cluster created on fresh hardware, or using cloud resources?
- What are the disaster recovery plans for my software applications?

:::page-break

# Verification

Before putting the system into a production environment it is worth verifying that the hardware and software is functioning as expected. The 2 key types of verification are:

- **Configuration:** Verifying that the system is functioning properly as per the server setup.
- **Performance:** Verifying that the performance of the system is as expected for the hardware, network and applications.

# Verifying the configuration

Simple configuration tests for the previous stages of the HPC platform creation will need to be performed to verify that it will perform to user expectations. For example, the following could be tested:

- Passwordless SSH between nodes performs as expected
- Running applications on different nodes within the network
- Pinging and logging into systems on separate networks

Best practice would be to test the configuration whilst it is being setup at regular intervals to confirm functionality is still as expected. In combination with written documentation, a well practiced preventative maintenance schedule is essential to ensuring a high-quality, long-term stable platform for your users.

# Testing System

There are multiple parts of the hardware configuration that can be tested on the systems. The main few areas are CPU, memory and interconnect (but may also include GPUs, disk drives and any other hardware that will be heavily utilised). Many applications are available for testing, including:

- Memtester
- HPL/Linpack/HPC-Challenge (HPCC)
- IOZone
- IMB
- GPUBurn

Additionally, benchmarking can be performed using whichever applications the HPC platform is being designed to run to give more representable results for the use case.

# Additional Considerations and Questions

- How will you know that a compute node is performing at the expected level?
    - Gflops theoretical vs actual performance efficiency
    - Network performance (bandwidth, latency, ping interval)
- How can you test nodes regularly to ensure that performance has not changed / degraded?
