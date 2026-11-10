# Vem2

Vem2 is a collection of scripts and tools designed to manage VVIZes

## What is a VVIZ?

A VVIZ, or Virtual VI(Z)ulisation node, is a process managed by SLURM, that provides a virtual login node that users can access directly.
These nodes have some computing power behind them, and can be used as fully independant computers, without having to interact with the scheduler or other nodes.
The advantage of this is that users with less familiarity with HPCs and their workflows can still access the power of a compute node, and can run jobs and processes like they would on any other computer.
They can be scheduled at any future time, and safeguards are in place to ensure that the VVIZ only runs if there is sufficient resources at that time to satisfy it.

## How are they created?

- vviz scripts
  - vm management
  - flavours
  - packages

- api
  - scheduling
  - auth
  - integrating with the vviz scripts

## Other tools

- monitoring tools

- cli
