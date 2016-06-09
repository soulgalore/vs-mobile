# vs-mobile
Test the performance of your page using your Android phone. Test one page or test two pages versus each others.

![Start page](start.png)

# What you get
Your page will be tested using Chrome and metrics will be collected using the Navigation Timing API and Chromes first paint. You will get a HAR file containing all the runs.

The result looks like this:
![Result page](result.png)

Checkout [the issues](https://github.com/soulgalore/vs-mobile/issues) what's left to do. 

# Prerequisites

## Desktop
* Install the Android SDK on your desktop: http://developer.android.com/sdk/index.html#downloads
* Start the adb-server on your desktop: adb start-server

## On your phone
* Install Chrome
* Enable developer USB access to your phone: Go to *About device*, tap it, scroll down to the *Build number*, tap it seven (7) times.
* Disable screen lock on your device.
* Enable *Stay awake*
* Enable *USB debugging* in the device system settings, under *Developer options*.
* Install the [Stay Alive app](https://play.google.com/store/apps/details?id=com.synetics.stay.alive) and start it.


## Start
```
npm run start
```
