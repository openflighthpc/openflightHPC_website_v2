# taac

The goal was to create a CLI tool that lets users create test clusters using Docker, offering the ability to customise, manage and access the created clusters from within the CLI.

# What was done

We built taac (Technically Almost A Cluster), a CLI that provisions test clusters out of Docker containers via the Docker API. Clusters are shaped at creation through options covering node count, resources, port, module manager, packages and startup commands, and can then be started, stopped, edited, executed against and accessed over SSH entirely from the CLI, with destroy commands supporting a preserve flag to recreate environments later.

# What was learnt

We learnt how far containers can be pushed towards behaving like cluster nodes, how capturing an environment's shape as declarative options makes clusters repeatable test fixtures, and how a single CLI lifecycle for creation, customisation, access and teardown removes the scatter of manual docker and SSH workflows.
