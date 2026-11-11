# Diskless Stakc

The goal was to build a diskless PXE-booted HPC stack using OverlayFS and cloud-init, providing a scalable and manageable way to deploy and maintain HPC clusters.

# What was done

We developed GHPC, an experimental Rocky Linux 9 stack using two VM appliances to deploy and manage HPC environments. Implemented four diskless node images (Hunter, Controller, Login and Compute), shared and node-specific persistent storage, and cloud-init for configuring nodes at boot.

# What was learnt

We learnt how PXE booting, OverlayFS and cloud-init can work together to manage diskless systems. We also explored shared configuration, persistent storage, disaster recovery and how separating base images from runtime changes can simplify HPC cluster management.
