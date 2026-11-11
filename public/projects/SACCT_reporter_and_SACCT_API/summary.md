# SACCT reporter

The goal of this project was to improve the metrics reporting of SACCT via a CLI tool to make managing a customers cluster easier.

## What was done

- Creation of a command line tool into SACCT that is able to convert line by line metrics into general metrics of cluster usage
- Able to filter to specific time periods, users, states and overall metrics to see how the cluster changed over time
- Export metrics to CSV tables for later processing

## What was learned

# SACCT API

The goal of this project was to use the knowledge from the SACCT CLI tool to act as an API to return JSON data on a SACCT cluster to result in a logical tree of the current usage of said cluster.

## What was done

- An API that interfaces with SACCT and allows for you to filter out SACCT metrics by user to see their usage
- Allows you to see the time spread (7/30/90 days) of change or allows you to put in a specific amount of days back of usage
- A CLI tool that allows for the API to be called without using Curl on your device.
- Said CLI tool also stores the current API address to make operations easier.

## What was learned
