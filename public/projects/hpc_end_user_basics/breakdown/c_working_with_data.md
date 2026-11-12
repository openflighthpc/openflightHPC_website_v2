## Working with data

:::collapse Storage types
# Storage Types

# Shared Storage

With HPC environments typically combining multiple hosts there comes the requirement to be able to share user data quickly between the available resources. Due to this, HPC environments usually have some sort of shared storage solution.

The shared storage solution can share user home directories between all the nodes, create shared mount-points for a project or department and even provide redundancy by using resilient storage back-ends.

# Local Scratch

Your compute nodes may have an amount of disk space available to store temporary data under the `/tmp` mount-point. This area is intended for temporary data created during compute jobs, and shouldn't be used for long-term data storage. Compute nodes are configured to clear up temporary space automatically, removing orphan data left behind by jobs.

Users must make sure that they copy data they want to keep back to the shared filesystem after compute jobs have been completed.

Utilising local scratch can dramatically increase the execution speed of HPC workflows that generate a lot of data during runtime where a lot of it isn't required for analysing results. By utilising the local scratch, this data can typically be written to, and read from, quicker than network shared storage.

:::

:::collapse Your Home Directory
# Your Home Directory

Linux automatically places users in their home-directory when they login to a node. By default, Linux will create your home-directory under the `/home/` directory. However, on some systems the home directory location may differ.

The Linux command line will accept the `~` (tilde) symbol as a substitute for the currently logged-in user's home-directory. The environment variable `$HOME` is also set to this value by default. Hence, the following three commands are all equivalent when logged in as a user called `flight`:

- `ls /home/flight`
- `ls ~`
- `ls $HOME`

The root user in Linux has special meaning as a privileged user, and usually does not have a shared home-directory across a research environment. The root account on all nodes is likely to have a home-directory in `/root`, which is separate for every node. For security reasons, users are not permitted to login to a node as the root.

:::

:::collapse Copying Data Between Hosts
# Copying Data Between Hosts

In a HPC environment there is likely to be a [shared filesystem](https://openflighthpc.org/lab/B4S1C5/docs/copy-between-hosts/storage-types.md#shared-storage), so it is not normally necessary to copy data directly between nodes in the research environment. Users simply need to place the data to be shared in their home-directory on the login node, and it will be available on all compute nodes in the same location.

If necessary, users can use the `scp` command to copy files between nodes. For example, the following will copy the file `myfile.txt` stored under `/tmp/` on node01 to the `cwd` (`.`) of this host:

```bash
scp node01:/tmp/myfile.txt .
```

Alternatively, users could login to a host that has unshared data on and copy the data back to the shared filesystem.

:::

### Copying Data

:::collapse Using the CLI
# Using the CLI
Usually a HPC environment will have a "login" or "gateway" node which is the entrypoint to the rest of the nodes. From outside of the HPC environment the data will need to be copied to this system (likely to shared storage) to make it available.

# Linux/Mac
Linux and Mac users can use in-built SSH support to copy files. For example, the following will copy the file mydata.zip to `/home/flight/mydata.zip` on host `52.48.62.34` authenticating as the user `flight`:

```bash
scp mydata.zip flight@52.48.62.34:/home/flight/
```

# Windows
Windows users can download and install the [pscp](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) command to perform the same operation (you may need your .pem key in .ppk format, see [connecting from Windows with Putty](https://openflighthpc.org/lab/B4S1C5/cli-basics/logging-in.md)):

For example, the following will copy the file `mydata.zip` to `/home/flight/mydata.zip` on host `52.48.62.34` authenticating as the user `flight`:

```bash
pscp -i mykeyfile.ppk mydata.zip flight@52.48.62.34:/home/flight/ # (1)!
```

Both the `scp` and the `pscp` commands take the parameter `-r` to recursively copy entire directories of files to the research environment.

To retrieve files from the research environment, simply specify the location of the remote file first in the scp command, followed by the location on the local system to put the file.
:::

:::collapse Using Graphical Client
# Using Graphical Client 
There are also a number of graphical file-management interfaces available that support the SSH/SCP/SFTP protocols. A graphical interface can make it easier for new users to manage their data, as they provide a simple drag-and-drop interface that helps to visualise where data is being stored. The example below shows how to configure the [WinSCP](https://winscp.net/eng/download.php) utility on a Windows client to allow data to be moved to and from a research environment.

- On a Windows client, download and install [WinSCP](https://winscp.net/eng/download.php).
- start WinSCP; in the **login** configuration box, etner the IP address of your login node in the `Host name`
- Enter the username you configured for your research environment in the `User name` box (e.g. `flight`)
- Click on the `Advanced` box and navigate to the `SSH` sub-menu, and the `Authentication` item.
- In the `Private key file` box, select your research environment access private key, and click the `OK` box.

![Config for private key file Image](./extras/winscpconfig.webp)

- Optionally clikc the `Save` button and give this session a name.
- Click the `Login` button to connect to your research environment.
- Accept the warning about adding a new server key to your cache; this message is displayed only once when you first connect to the research environment.
- WinSCP will login to your research environment; the window shows your local client machine on the left, and the research environment on the right
- To copy files to the research environment from your client, click and drag them from the left-hand window and drop them on the right-hand window
- To copy files from the research environment to your client, click and drag them from the right-hand window and drop them on the left-hand window

![win scp files page](./extras/winscpcopyfiles.webp)

The amount of time taken to copy data to and from your research environment will depend on a number of factors, including:

- The size of the data being copied
- The speed of your Internet link to the research environment; if you are copying large amounts of data, try to connect using a wired connection rather than wireless
- The type and location of your research environment login node in relation to your client location

:::

:::collapse Object Storage for Archiving Data
# Object Storage for Archiving Data

As an alternative to copying data back to your client machine, users may prefer to upload their data to a cloud-based object storage service instead. Cloud storage solutions such as [AWS S3](https://aws.amazon.com/s3/), [Dropbox](https://www.dropbox.com/) and [SWIFT](https://wiki.openstack.org/wiki/Swift) have command-line tools which can be used to connect existing cloud storage to your research environment. Benefits of using an object-based storage service include:

- Data is kept safe and does not have to be independently backed-up
- Storage is easily scalable, with the ability for data to grow to practically any size
- You only pay for what you use; you do not need to buy expansion room in advance
- Storage service providers often have multiple tiers available, helping to reduce the cost of storing data
- Data storage and retrieval times may be improved, as storage service providers typically have more bandwidth than individual sites
- Your company, institution or facility may receive some storage capacity for free which you could use

Object storage is particularly useful for archiving data, as it typically provides a convenient, accessible method of storing data which may need to be shared with a wide group of individuals.

:::