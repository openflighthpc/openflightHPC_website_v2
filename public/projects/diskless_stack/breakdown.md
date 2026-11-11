# Hypothesis

The goal of this project was to build a diskless PXE-booted HPC stack using OverlayFS and cloud-init.

GHPC is an experimental Rocky Linux 9 stack built around diskless PXE booting and OverlayFS. It aims to provide a scalable and manageable way of deploying and operating multiple HPC clusters from a single site.

# Approach

![stack launch process gif](extras/ghpc-how-it-works.gif)

GHPC is distributed as two virtual machine appliances that can be deployed on a platform of choice. Together, these appliances provide the tools required to create, deploy and manage multiple HPC and AI stacks.

The Director and Domain operate within a dedicated Domain Network. The Director is responsible for creating Controllers, which then manage the services and resources within individual clusters.

The aim of the project was to provide a quick and straightforward way to deploy an example HPC stack, while ensuring that its architecture reflects a production HPC environment similar to those used in Alces deployments.

The project also explores disaster recovery and change management. When a node is rebooted, its original state is restored unless changes have been made to its source configuration. This allows users to experiment with their environments without permanently damaging the underlying host operating system.

### Architecture

#### Diskless Exports

GHPC provides four different diskless images that systems can boot from, depending on their assigned identity:

- **Hunter:** Used by systems that have not yet been assigned an identity. It identifies key system information, such as the boot interface and MAC address.
- **Controller:** Provides the environment for controller nodes, including the SLURM controller daemon and other cluster management services.
- **Login:** Provides the environment for login nodes, including Flight Web Suite for remote access.
- **Compute:** Provides a minimal environment for compute nodes, prepared for running HPC workloads.

In addition to these images, each cluster has access to shared persistent storage. This allows files that need to remain consistent across all nodes to be maintained in one location. For example, the `/etc/slurm/slurm.conf` configuration file is served from this shared storage, meaning it only needs to be updated once for the change to be reflected across the cluster.

Each individual system also receives its own persistent export, allowing node-specific changes to be stored separately.

This diskless architecture makes it possible to update the source images and change the configuration of multiple systems without needing to rebuild each node individually.

#### Cloud Init

Cloud-init is used to inject personality information into each host during boot. This allows systems to receive the configuration associated with their assigned identity and initialise themselves accordingly.

#### Overlayfs

The shared base image is mounted as read-only on each host. OverlayFS is then used to provide a writeable layer on top, allowing systems to be modified while running without changing the underlying source image.

An additional benefit of this approach is that differences between the running host and its original image can be identified. These changes are stored in `/run/upper/data/host`, making it easier to inspect and understand how a system has diverged from its base configuration.

### Documentation

Documentation for GHPC is kept relatively minimal on the [project website](https://ghpc.openflighthpc.org/). Instead, most of the documentation is included within the Director appliance itself.

This approach helps ensure that documentation remains alongside the software and supports fully offline deployments, where external documentation websites may not be accessible.

The [Glow](https://github.com/charmbracelet/glow) project is used alongside a simple [documentation wrapper script](https://github.com/alces-flight/ghpc-docs) to render Markdown documentation in a readable and easy-to-navigate format.

![physical node setup](extras/PhysicalNodesSetup.gif)

# What was learnt

This project provided experience in designing and deploying diskless HPC environments, particularly using PXE booting, OverlayFS and cloud-init. We gained a better understanding of how different node identities can be used to provide specific roles within a cluster, while maintaining a shared and consistent base configuration.

We also explored how persistent storage and writeable overlay layers can be combined to support both shared configuration and node-specific changes. This highlighted the benefits of separating the underlying system image from runtime modifications, particularly for disaster recovery, experimentation and configuration management.

Finally, we learnt how packaging documentation within an appliance can make a system easier to deploy and maintain in offline environments.

Overall, the project demonstrated how diskless architecture can simplify the deployment and management of HPC clusters, making it easier to maintain consistency, recover systems and manage multiple environments.

## Links

[website](https://ghpc.openflighthpc.org/)

[documentation wrapper](https://github.com/alces-flight/ghpc-docs)
