# Hypothesis
The goal of this project was to develop a Ruby on Rails application for tracking cloud computing costs and managing instances across AWS and Azure.

Flight Control provides visibility into cloud expenditure across projects, enables users to manage instance lifecycles, and helps organisations control spending through budget policies, automated recommendations and resource management actions.
# Approach
Flight Control brings together cost monitoring, instance management and budget controls in a single application.

![Flight Control Overview Video](extras/flight-control-preview.mp4)

### Key features

#### Cost Tracking

- Records and displays cloud computing costs across projects hosted on AWS and Azure.
- Provides dashboards showing resource utilisation and expenditure.
- Maintains historical cost records to support reporting and analysis.

#### Instance Management

- Allows users to start and stop instances through change requests.
- Supports group-based power operations, making it easier to manage multiple instances.
- Records instance state changes to provide visibility into resource activity.

#### Budget Management

- Supports budget policies with automated recommendations for switching off instances.
- Identifies idle nodes and provides automatic shutdown capabilities.
- Monitors CPU utilisation to identify underused resources and potential cost savings.

#### Integration
- **Slack integration:** Sends notifications, alerts and reports.
- **Flight SSO:** Provides authentication through Flight's single sign-on system.
- **Role-based permissions:** Controls access according to user roles.
- **Scheduled tasks:** Uses cron to automate daily reports, instance logging and cost logging.
- **Background processing:** Uses Resque to handle background jobs.
- **Audit logging:** Maintains records of application activity and management actions.

### Use Cases

Flight Control is designed to help organisations:

- Monitor cloud computing costs across multiple projects and providers.
- Manage compute instance lifecycles to reduce unnecessary expenditure.
- Apply budget policies and act on recommendations to control spending.
- Understand resource utilisation through dashboards and historical reporting.
- Coordinate team access using role-based permissions.

By combining cost tracking with instance management and automation, Flight Control addresses the challenge of running cost-effective cloud HPC environments. It gives organisations the tools to monitor spending, identify wasted resources and keep cloud costs under control.

# What was learnt

The project demonstrated how cost monitoring, resource management and automation can work together to improve cloud efficiency. Integrating with multiple cloud providers also highlighted the importance of providing a consistent management interface across different platforms.

It also showed how scheduled tasks, background job processing and integrations such as Slack can automate routine operations and keep users informed. Budget policies and resource utilisation monitoring can help organisations identify unnecessary expenditure and make better decisions about their cloud resources.

Overall, Flight Control provides a centralised approach to managing cloud infrastructure, helping make cloud HPC environments more visible, efficient and cost-effective.

## Links

[github](https://github.com/openflighthpc/flight-control)