---
layout: post
title: "How-To: Intel NUC6i3SYH Media Server"
date: 2016-04-01 01:13 -0500
byline: Building a Media Server with FlexGet, Deluge, Plex and Fedora 24
tags:
  - howto
  - nuc
---

Create a tiny form-factor streaming media server based on [Intel NUC6i3SYH](https://www.intel.com/content/www/us/en/nuc/nuc-kit-nuc6i3syh.html) that can be installed virtually anywhere in your house or living room. Powered by the latest 6th generation Intel Skylake technology this computer fits in your palm yet fills your living room with entertainment.

**6th generation Intel NUC kits are still to be considered bleeding edge. Unless you follow the hardware guide in this how-to, you may not end up with a working system.**

![](/public/img/posts/2016/03/NUC6i3SYH.png "Intel NUC6i3SYH")

> Intel® NUC Kit NUC6i3SYH is equipped with Intel’s newest architecture, the 6th generation Intel® Core™ i3-6100U processor. With 7.1 surround sound and a full-sized HDMI port for brilliant 4K resolution, NUC6i3SYH can power home entertainment and light gaming. NUC6i3SYH has room for a 2.5” drive so you can store all your media and an M.2 SSD so you can transfer your data at lightning speed. Designed for Windows® 10, NUC6i3SYH has the performance to stream media, manage spreadsheets, or create presentations.

### Required components

- [Intel NUC6i3SYH Kit](https://www.newegg.com/Product/Product.aspx?Item=N82E16856102146)
- [Samsung Spinpoint MT9 2TB 5400 RPM](https://www.newegg.com/Product/Product.aspx?Item=N82E16822178627)
- [Kingston HyperX Impact 8GB (2 x 4GB)](https://www.newegg.com/Product/Product.aspx?Item=N82E16820104587)

## Installing Fedora Workstation

This guide assumes that you have set up an administrator user account for yourself. Installing Fedora Workstation will require you to enable the SSH server on your machine:

    $ sudo systemctl enable sshd
    $ sudo systemctl start sshd

Install tools required by this guide:

    $ sudo dnf install nano lm_sensors boost-devel
    export EDITOR=nano
    $ sudo pip install --upgrade setuptools
    $ sudo pip install --upgrade pip

## Setting up system

We are opting for an automated system that we do not have to touch other than to edit a configuration file to add more shows that we are interested in watching.

Through this how-to we will assume that your server has a particular IP, 192.168.1.110. You can either set your server’s IP to this, or replace it throughout with your own IP.

### Installing Deluge

Install Deluge on the system:

    $ sudo dnf install deluge-daemon \
    	deluge-web deluge-console

Verify installation of Deluge:

    $ deluge-console -v

You should see output similar to this:

    deluge-console: 1.3.12
    libtorrent: 1.0.9.0

Enable Deluge Daemon and Web interface:

    $ sudo systemctl enable deluge-web.service deluge-daemon.service
    $ sudo systemctl start deluge-web.service deluge-daemon.service

Configure Deluge via the web interface:

- Open a web browser
- Navigate to `https://192.168.1.110:8112`
- The default password is `deluge`

Change download folder to `/home/plex/.incomplete`. Change the auto-load torrents from folder to `/home/plex/.torrents`.

![](/public/img/posts/2016/04/deluge-dir-config.png)

Activate the Label plugin.

![](/public/img/posts/2016/04/deluge-plugin-config.png)

### Installing Plex

Download the latest 64-bit version of Plex for Fedora:

    $ wget https://downloads.plex.tv/plex-media-server/0.9.16.3.1840-cece46d/plexmediaserver-0.9.16.3.1840-cece46d.x86_64.rpm

Note, the Fedora download is the same for Public and PlexPass.

Install Plex:

    $ sudo rpm -ivh plexmediaserver-0.9.16.3.1840-cece46d.x86_64.rpm

First off we need to fix some discrepancies in the Plex Media Server `systemd` startup scripts.

    $ sudo nano /usr/lib/systemd/system/plexmediaserver.service

Replace the line that starts with `ExecStart=` with the following content:

    ExecStart=/usr/bin/env LD_LIBRARY_PATH=/usr/lib/plexmediaserver "/usr/lib/plexmediaserver/Plex Media Server"

Replace `plex` in `User` and `Group` settings with `deluge`:

    User=deluge
    Group=deluge

Change the permissions of the directories to `deluge` instead of `plex`. We are doing this because we want to make moving and renaming files as easy as possible.

    $ sudo chown -Rf deluge\: /var/lib/plexmediaserver

Once that’s done we can start the service.

Let’s enable the service so that it starts at boot:

    $ sudo systemctl enable plexmediaserver.service
    $ sudo systemctl start plexmediaserver.service

Then let’s start the Plex Media Server up and go configure it so that we’re ready to watch some awesome shows once we’re done with this how-to.

You'll need to know the server's internal IP Address. Once you know that IP address, on a PC in your home:

- Open a web browser
- Navigate to `https://192.168.1.110:32400/web`

The first time you load Plex Web App, a [Wizard](https://support.plex.tv/hc/en-us/articles/200288896) will lead you through a series of steps that will set up the Server and prompt you in the creation of Libraries for your media.

### Installing FlexGet

Install FlexGet on the system:

    $ sudo pip install flexget

Verify installation of FlexGet:

    $ flexget -V

You should see output similar to this:

    1.2.498
    You are on the latest release.

Set up FlexGet as a daemon on the system:

    $ sudo touch /etc/systemd/system/flexget.service
    $ sudo chmod 664 /etc/systemd/system/flexget.service
    $ sudo nano /etc/systemd/system/flexget.service

When nano opens the above created file, paste the following content into it:

    [Unit]
    Description=Flexget Daemon
    After=network.target

    [Service]
    Type=simple
    User=deluge
    Group=deluge
    UMask=007
    WorkingDirectory=/etc/flexget
    ExecStart=/usr/bin/flexget daemon start
    ExecStop=/usr/bin/flexget daemon stop
    ExecReload=/usr/bin/flexget daemon reload

    [Install]
    WantedBy=multi-user.target

In order to save the file, click `Ctrl+X`, hit `Y` then `Enter`.

Let’s reload `systemd` to make it aware of our new service:

    $ sudo systemctl daemon-reload

We can then enable our FlexGet service:

    $ sudo systemctl enable flexget.service

Create the configuration directory for FlexGet:

    $ sudo mkdir /etc/flexget
    $ sudo chown deluge:deluge /etc/flexget

We can now place our `config.yml` file in the `/etc/flexget` directory by creating it with our editor:

    $ sudo nano /etc/flexget/config.yml

Paste the following into the configuration file:

{% raw %}
tasks:
myshows:
rss: <your RSS link here>
thetvdb_lookup: yes
series:
settings:
720p:
quality: 720p
set:
content_filename: "{{series_name}} - {{series_id}}{% if tvdb_ep_name|default(False) %} - {{ tvdb_ep_name }} {% endif %} - {{quality}}"
movedone: "/home/plex/TV/{{series_name}}/Season {{series_season}}/"
label: tv
720p: - Limitless
deluge:
path: /home/plex/.incomplete
ratio: 1.0
maxupspeed: 150.0
main_file_only: yes
hide_sparse_files: yes
removeatratio: yes
magnetization_timeout: 120
schedules: - tasks: 'myshows'
interval:
minutes: 15
api: yes
{% endraw %}

You’ll need to set up your own RSS feed somewhere, I recommend [showrss.info](https://showrss.info/), then replace `<your RSS link here>` with the URL for your personal RSS feed.

Once we have added our configuration file we can start the FlexGet service and it will automatically download new episodes of our favorite shows.

    sudo systemctl start flexget.service

We should now have an automated streaming media server that automatically downloads new shows as they become available and adds them to our Plex server. All handled by a tiny computer that can easily be mounted on the back of your TV, all for under $450.
