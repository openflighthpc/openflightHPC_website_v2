# Hypothesis

The goal of this project was to develop an HPC-ready, platform-agnostic image that enables the rapid deployment of complete High Performance Computing (HPC) environments.

Flight Solo provides researchers and scientific users with a personal HPC environment, supporting deployment across on-demand, reserved and spot cloud instances.

The image comes preconfigured with a job scheduler, software applications and a remote desktop service. It supports multiple software management frameworks, including Spack, EasyBuild and Conda, providing access to hundreds of applications, libraries, compilers and MPI implementations. It also includes data management tools for POSIX and S3-compatible object storage, making it easier to transfer files and manage storage resources.

# Approach

### Architecture

Flight Solo is built around three key components:

- **HPC-Optimised Rocky 9 OS:** A clean Rocky Linux Enterprise 9 image configured for HPC workloads. It includes kernel drivers to support a range of virtualisation platforms, alongside appropriate security settings.
- **Cloud-Init Integration:** Uses Cloud-Init to inject runtime information and configuration into the operating system when a cloud instance is provisioned. This allows the environment to be configured flexibly at deployment time.
- **Flight Environment:** The complete Flight Environment is installed by default, with configuration optimisations to provide a ready-to-use HPC experience.

[project](flight_environment)

### Use Cases

Flight Solo is designed to support several use cases:

- Helping researchers and end-users get started with HPC quickly, without needing to build an environment from scratch.
- Rapidly deploying consistent and reproducible HPC environments.
- Creating proof-of-concept HPC environments in the cloud.
- Evaluating the Flight Environment and its capabilities.

### Platform Agnostic

A key design goal was to make Flight Solo independent of any particular cloud provider. The image build process enables the same image to be distributed across different platforms, including OpenStack, AWS and Azure.

The image was also made available through the AWS Marketplace, providing users with a straightforward way to find and deploy it.

### Outcomes

The project delivered:

- HPC-ready cloud images with the Flight Environment pre-installed and configured.
- A platform-agnostic deployment approach supporting multiple cloud platforms.
- A faster way to provision complete HPC environments, reducing the setup required from end-users.

# What was learnt

The project demonstrated how a preconfigured, platform-agnostic image can simplify access to HPC resources. By combining an HPC-optimised operating system, Cloud-Init and the Flight Environment, it is possible to provide a consistent environment that can be deployed across different cloud platforms.

It also highlighted the importance of separating the base image from runtime configuration. This allows the same image to be reused across different deployments while adapting to the specific requirements of each cloud environment.

Overall, Flight Solo showed how cloud images can reduce the complexity of setting up HPC environments, making them more accessible and repeatable.

## Links

[pretty-link:::Flight Solo Documentation:::Part of a github repository containing documentation for Flight Solo](https://github.com/openflighthpc/docs.openflighthpc.org/tree/release/2024.1/docs/docs/flight-solo)

[pretty-link:::Flight Solo:::A link to flight solo](https://openflighthpc.github.io/docs.openflighthpc.org/latest/solo/)
