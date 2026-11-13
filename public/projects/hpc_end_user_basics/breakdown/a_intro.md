# Hypothesis

The goal of this project is to provide documentation covering the fundamental concepts and skills needed to work with a High Performance Computing (HPC) environment. Whether you're new to HPC or looking for a refresher, these guides will help you understand how to navigate and use research environments effectively.

# Outcomes

- Provided comprehensive HPC environment introduction for new users.
- Covered essential CLI skills and data management.
- Documented Slurm workload manager usage.
- Included bulk host management tools for administrators.

# Documentation

# Genders and PDSH

# Overview

Genders provides a simple method for categorising a node inventory. To learn more about genders, read the [official tutorial](https://github.com/chaos/genders/blob/master/TUTORIAL).

PDSH provides a CLI tool for performing commands on multiple nodes at once, utilising the data stored in genders. To learn more about using PDSH, read the manual page for the command `man pdsh`.

# Installing Genders and PDSH

The packages should be available in the package manager for your distribution. To install on CentOS/RHEL/Rocky:

```bash
dnf install pdsh genders
```

You will need `sudo` permissions to install packages, see [becoming the root user](https://openflighthpc.org/lab/B4S1C5/docs/cli-basics/becoming-root.md) for more information.

# Creating a Genders File

Open the genders file (`/etc/genders`) with your preferred text editor and add a gender in with the following format:

```bash
node01,node02,node03,node04,node05 gendername
```

There are alternate formats that make writing a gender easier:

```bash
node01,node02,node03,node04,node05:    node[01-05]
node3,node7,node9,node10,node11:       node[3,7,9-11]
nodei,nodej,node0,node1,node2:         nodei,nodej,node[0-2]
```

For example:

```bash
node[01-05] mygroup1
nodeA,nodeB,node[1,2,3,10-20],nodeC mygroup2
```

After adding the desired gender(s), save and close the file.

# Finding the Names of your Compute Nodes

In best practice, the hostnames of compute nodes usually follow a sequential order (e.g. node01, node02, node03... node10).

Users can find the names of their compute nodes by using the `nodeattr` command with a group; e.g.

- Show a space-separated list of hosts in the group 'nodes'

```bash
nodeattr -s nodes
```

- Show a comma-separated list of hosts in the group 'group'

```bash
nodeattr -c group
```

- Show a newline-separate list of hosts in the group 'groups'

```bash
nodeattr -n groups
```

# Using PDSH

Users can run a command across many hosts at once using the `pdsh` command. This can be useful if users want to make the same change to multiple systems in the research environment - for example, installing a new software package. The pdsh command can take a number of parameters that control how commands are processed; for example:

- Run `uptime` across hosts in the 'all' group

```bash
pdsh -g all uptime
```

- Install the package `screen` with `yum` on all hosts in the 'nodes' group

```bash
pdsh -g nodes 'sudo yum -y install screen'
```

- Check usage of `/tmp` on all hosts in the 'nodes' group one at a time.

```bash
pdsh -g nodes -f 1 df -h /tmp
```

- Run `which ldconfig` on two specified hosts.

```bash
pdsh -w node01,node03 which ldconfig
```

:::page-break
