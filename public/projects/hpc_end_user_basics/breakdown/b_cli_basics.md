## CLI Basics


# Logging In

You can access the login node for your research environment using SSH to connect to the externally facing IP address of the login node. You will need to use the SSH keypair configured for the research environment in order to access it.

When you login to the research environment via SSH, you are automatically placed in your home-directory. This area is shared across all compute nodes in the research environment, and is mounted in the same place on every compute node. Data copied to the research environment or created in your home-directory on the login node is also accessible from all compute nodes.

# Linux/Mac

To access the research environment login node from a Linux or Mac client, use the following command:

```bash
ssh -i mypublickey.pem flight@52.50.141.144
```

Where:

- `mypublickey.pem` is the name of your private key associated with the public SSH key of your user.
- `flight` is the username of the user on the research environment.
- `52.50.141.144` is the Access-IP address for the gateway node of the research environment.

# Windows

If you are accessing from a Windows client using the Putty utility, the private key associated with the account will need to be converted to ppk format from pem to be compatible with Putty. This can be done as follows:

- Open PuTTYgen (this will already be installed on your system if Putty was installed using `.msi` and not launched from the `.exe`) if you do not think you have this, download putty-installer from [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
- Select Conversions -> Import Key
- Locate .pem file and click open
- Click Save Private Key
- Answer Yes to saving without a passphrase
- Input the name for the newlu generated ppk to be saved as

To load the key in Putty, select Connection -> SSH -> Auth, click Browse and select the ppk that was generated from the above steps.

![Putty Key image](./extras/PuttyKey.webp)

Next, enter the username and IP address of the research environment login node in the “Host Name” box provided (in the Session section):

![Putty session section image](./extras/putty.webp)

The first time you connect to your research environment, you will be prompted to accept a new server SSH host-key. This happens because you've never logged in to your research environment before - it should only happen the first time you login; click OK to accept the warning. Once connected to the research environment, you should be logged in to the research environment login node as your user.

![First login image](./extras/firstlogin.webp)

:::page-break


# Understanding the CLI

Usually a lot of HPC environment usage takes place via the Linux command line. For unfamiliar users here is a brief description of a typical CLI prompt.

```bash
[flight@chead1 folder]$ echo Hello World!
Hello World!
```

- `flight` is the name of the user.
- `chead1` is the node the user is currently on.
- `folder` is the directory the user is currently in. If this is a `~` then that means you are in your home directory.
- `$` indicates whether the user is a root user or normal user (root users see a `#`).
- `echo Hello World!` is a command that prints out "Hello World!". This is where commands you type will go.

The prompt can vary based on user preference and global environment configuration. The above is an example for illustrative purposes.

:::page-break


# Moving Between Hosts

Usually SSH is used to navigate between systems in a HPC environment. This provides a secure shell connection to another host in order to access the CLI on that system.

The first connection between two hosts will create a trust relationship. Depending on the user management solution for the HPC environment it may be possible to navigate between hosts without being prompted for a password or needing to specify a private key which would allow moving quickly and seamlessly between hosts and simplifying the running of large-scale jobs which involve multiple nodes.

From the command line, a user can simply use the `ssh <node-name>` command to login to one of the compute nodes from the login node. For example, to login to a compute node named `node01` from the current hosts, use the command:

```bash
ssh node01
```

Use the command `logout` or `exit` (or press **CTRL+D**) to exit the compute node and return to the previous host.
:::page-break


# Becoming the Root User

Most research environment operations, including starting applications and running jobs, should be performed by a regular user. However - for some privileged operations, users may need to change to being the root user. Users can prefix any command they want to run as the root user with the `sudo` command; e.g.

```bash
sudo yum install screen
```

To get a Linux shell with root privileges, please login as your standard user then execute the command `sudo -s`.

Users must exercise caution when running commands as root, as they have the potential to disrupt research environment operations.

Some users may not have root privileges. This is at the discretion of your admin or system configuration.

You can log out of the root user by running the command `exit`, `logout`, or by pressing **CTRL+D**.
:::page-break
