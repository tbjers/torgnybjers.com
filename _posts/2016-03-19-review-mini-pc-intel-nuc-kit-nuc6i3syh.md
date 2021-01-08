---
layout: post
title: 'Review: Mini-PC Intel NUC Kit NUC6i3SYH'
date: 2016-03-19 01:20 -0500
byline: The Broken Memories of Princess Skylake; or How to match the correct RAM to your new NUC6i3SYH
tags:
  - review
  - nuc
---
A couple of weeks ago my [Intel NUC6i3SYH](http://www.intel.com/content/www/us/en/nuc/nuc-kit-nuc6i3syh.html) Mac Mini killer arrived. Unfortunately Newegg bundled it with the wrong RAM. Unbeknownst to me, the new Skylake architecture Intel NUCs are very particular when it comes to the types and makes of memory modules. Through some reading as well as trial and error I finally found RAM that worked.

**6th generation Intel NUC kits are still to be considered bleeding edge. Unless you follow the guide in this review to the point on hardware purchases you may not end up with a working system. You’ll need Windows 10 or a very recent Linux distribution to fully appreciate the wonders of this NUC.**

![](/public/img/posts/2016/03/NUC6i3SYH.png "Intel NUC6i3SYH")

> Intel® NUC Kit NUC6i3SYH is equipped with Intel’s newest architecture, the 6th generation Intel® Core™ i3-6100U processor. With 7.1 surround sound and a full-sized HDMI port for brilliant 4K resolution, NUC6i3SYH can power home entertainment and light gaming. NUC6i3SYH has room for a 2.5” drive so you can store all your media and an M.2 SSD so you can transfer your data at lightning speed. Designed for Windows® 10, NUC6i3SYH has the performance to stream media, manage spreadsheets, or create presentations.

### Hardware used for review

- [Intel NUC6i3SYH Kit](http://www.newegg.com/Product/Product.aspx?Item=N82E16856102146)
- [Samsung Spinpoint MT9 2TB 5400 RPM](http://www.newegg.com/Product/Product.aspx?Item=N82E16822178627)
- [Crucial 8GB Kit (4GBx2) DDR4](http://www.amazon.com/gp/product/B015HQ9UDO)
- [Kingston HyperX Impact 8GB (2 x 4GB)](http://www.newegg.com/Product/Product.aspx?Item=N82E16820104587)

## Update the NUC’s BIOS

Before I installed any of the RAM modules I updated the BIOS to the latest revision, `0036` at writing, in order to ensure that I didn’t run into any problems.

## Finding the correct RAM modules

After several days of trial and error I gave up on trying to make the bundled RAM work and ordered what people said would work: [Kingston HyperX Impact 8GB (2 x 4GB)](http://www.newegg.com/Product/Product.aspx?Item=N82E16820104587). Once ordered, I had to wait. After about four days I grew so impatient with the slow shipping speeds of the combined shenanigans that is UPS MI and USPS that I overnighted a [Crucial 8GB Kit (4GBx2) DDR4](http://www.amazon.com/gp/product/B015HQ9UDO) from Amazon after having checked that there’s at least some kind of [alleged compatibility](http://www.crucial.com/usa/en/compatible-upgrade-for/Intel/nuc6i3syh).

## Windows 10

When the Crucial sticks arrived I immediately installed them in the NUC and attempted to install Windows 10 x86\_64. Installation went without a hitch and I was up and running with Windows 10 in short order.

Phew. What a relief to finally have found some RAM that worked, and on top of that, it was RAM that apparently none of the other users had tested. Not only did I have a working Apple Mini killer, I had provided a service to the community by testing RAM nobody else had tried so far.

After Windows was installed and booted I promptly began installing all [available drivers](https://downloadcenter.intel.com/product/89189) from the Intel Support page. Once that was done I was ready to do some real testing.

### Initial impressions of Windows

After having run Windows 10 for about 4 hours I was quite happy with how everything was working. Intel HD Graphics 520 handled the display on my 1080p TV just fine and the HDMI was fully functional with 7.1 surround sound. Using a USB 2.0 dongle for my Logitech K400 Touch Keyboard was tricky because the radios in the NUC were interfering with the wireless dongle. A USB extension cable solved that problem neatly.

Once installation and initial configuration was complete I installed Plex Media Server and Plex Media Player. Plex Server worked like a charm. The same could not be said about the standalone player. I elected to just browse via Chrome or from Xbox or Chromecasts.

Plugging a USB 3.0 stick into the NUC resulted in sheer joy. Copy speeds in Windows 10 were fantastic over 3.0! Write speeds of the 5400 RPM drive I installed were acceptable at between 40 MB/sec and 80 MB/sec.

### Problems with Windows

**Intel’s aware of this issue and are currently working on finding a solution.** Everything worked fine with Windows apart from sleep recovery and powering the TV back on after a few hours. For some reason the NUC would only present a black screen in some cases. At first I thought it had frozen, though after being able to connect with Chrome Remote Desktop I logged into the machine and ran Intel Display Manager. For some reason the resolution refresh rate was set to 0Hz @ 1920x1080.

## Linux

After having played around in Windows 10 for a while I decided it was time to put the big-boy pants on and try an operating system better suited as a media server. Unfortunately I couldn’t get any of the standard USB installers to work with currently stable versions of Ubuntu 15.10 or Fedora 23.

The more common Linux distribution I tried fail on disk checks, presumably because they do not have proper kernel support for the 6th generation Intel NUC chipset. They were unable to install an operating system 95% of the time (I managed to fully install Fedora 23 once in a stroke of sheer luck). Live CDs would boot and run, but installation would inevitably fail.

### Have time machine, need travel companion

I felt I had to travel to the future to solve my problem. I brought back Fedora Rawhide. Now, mind you, this is early stage testing images of an operating system that will be released some time in 2017. Don’t try this at home unless you feel adventurous. You’ll have to bring your own weapons.

**Word of caution: Pay very close attention to `dnf uninstall` procedures, required system packages may get uninstalled by accident otherwise. You’ll have a really fun time trying to get `libidn` back onto your system as it will cause `dnf`, `yum`, `wget`, `tar` and various other applications to crash. Did I mention the future is treacherous?**

Warnings issued, gear donned; let’s step into the future. Finding and downloading Fedora Rawhide images can be an adventure in itself. I’ve made things easier by linking to the correct FTP directories for you:

- [Fedora Rawhide Server](http://dl.fedoraproject.org/pub/fedora/linux/development/rawhide/Server/x86_64/iso/)
- [Fedora Rawhide Workstation](http://dl.fedoraproject.org/pub/fedora/linux/development/rawhide/Workstation/x86_64/iso/)

Once you have created a bootable USB, you may have to run the installer in text-only mode because the graphical installer failed to start in my case. It may be fixed by the time you read this article, so who knows.

### Initial impressions of Linux

After installing and rebooting into Linux, everything worked for me, including installing packages for mounting my wife’s external drive with an `exFAT` file system. Sweet!

## Opinions and overall verdict

Once you’ve got the right RAM modules in this bad boy it’s an absolute thrill to use. Windows 10 works straight out of the box and performs awesomely. Linux is a bit of a tricky situation as always, but can be installed if you’re a bit daring.

Caveat, if you’re looking for something you can plug a cord into and run with, this isn’t for you. You should spend an additional $500 and buy a Mac Mini with the same specs and consequently make your significant other angry.

The rest of you: **Get one, you won’t regret it!**

## Shopping List

If you want a cheap system with enough space and RAM to get you going in most cases, here’s your guaranteed to work shopping list:

- [Intel NUC6i3SYH Kit](http://www.newegg.com/Product/Product.aspx?Item=N82E16856102146)
- [Samsung Spinpoint MT9 2TB 5400 RPM](http://www.newegg.com/Product/Product.aspx?Item=N82E16822178627)
- [Kingston HyperX Impact 8GB (2 x 4GB)](http://www.newegg.com/Product/Product.aspx?Item=N82E16820104587)

For those of you willing to spend a little bit of extra money I do recommend buying an M.2 SSD, though I’d recommend you do plenty of research before doing so because some are apparently not entirely supported by the BIOS. Caveat emptor.

If you enjoyed this review, have questions or concerns, please hit me up on twitter! [@torgnybjers](https://twitter.com/torgnybjers)
