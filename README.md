# Entry Automation (Chrome Extension)
_Entry-automation is a browser extension that automates the adding of item in the inventory system. These extension is only work for certain web application._

## Overview
1. To summarize the content of the extension, it is built with javascript and function to select the input field of the inventory, assign value that corresponds to the input field, and repeat the entire process until done.
2. It requires an array of objects formatted data and can be added through pasting the url. So you need to configure the data first for the extensionto work properly.
3. In my case, the data is stored in google sheet and I formatted the data using google app script.
4. If you want to create your own you can check the source code. Thanks for reading.
   
<br/>

| Appscript | Input Bar | Extension App |
| --------- | ----- | ------------- |
| Customize data in array of objects using google sheet. | Get the link from appscript and paste it in the input bar of the extension. | Click Run. Extention will automatically added this data in the input node of html and do all the submission. |

  
