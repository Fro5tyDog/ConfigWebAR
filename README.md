# LTA WebAR Solutions

This is a web application that bundles all existing WebAR projects into one. It utilises settings within a JSON file for users to adapt their own assets in a more modular and user-friendly manner. All settings are dynamically loaded through the DOM via javascript.

## For Developers

Download the files by [forking](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the repository and using [github desktop](https://github.com/apps/desktop). 

If you wish to run the application on a local host, you may use [git clone](https://github.com/git-guides/git-clone) or download the zipped version of the repository. 

**NOTE THAT IF YOU RUN ON LOCAL HOST, YOU MUST HAVE A HTTPS CONNECTION**

```bash
git clone https://github.com/Fro5tyDog/ConfigWebAR.git
```
Please see the Developer Guide within [this](https://drive.google.com/drive/folders/13GVOiY32c2uWppKJ5ZMXRSwxtGfOGYEx?usp=sharing) Google Drive to learn more about the project and configuration

## Usage

This project relies on a JSON file that contains editiable settings for developers. Below is an example of a JSON and what you will be seeing. To be able to understand all of the settings available, please read the [documentation](https://docs.google.com/document/d/1I3kQmtMRPS6pkKXD5JElM7wuc5F27URZ/edit?usp=sharing&ouid=101033659162590948863&rtpof=true&sd=true) for this project.

```json
{
    "projects": {
        "locationBasedAR": {
        "enabled": false
        },
        "targetBasedAR": {
        "enabled": true
        }
    },
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

**Current Contributors**
| Name | Description |
| --- | --- |
| Ignatius | Intern from Republic Poly (18 March 2024 - 17 Jan 2025) |


## Programming Languges and Third-Party Software

_Do familiarise yourself with the following languges and third-party software before attempting to develop on this project._

- **languages**
  - [html](https://www.w3schools.com/html/)
  - [css](https://www.w3schools.com/css/)
  - [javascript](https://www.w3schools.com/js/)
  - [json](https://www.w3schools.com/js/js_json_intro.asp)<br><br>

- **Third-Party Software**
  - [AFrame](https://aframe.io/docs/1.6.0/introduction/)
  - [MindAR](https://hiukim.github.io/mind-ar-js-doc/)
  - [Model Viewer](https://modelviewer.dev/)

## Helpful Links

[DOM Render Not Showing Up](https://stackoverflow.com/questions/44351745/why-dom-didnt-update-by-setattribute-when-using-aframe-v0-5-0)<br>
[Location-Based Toy Project](https://medium.com/chialab-open-source/build-your-location-based-augmented-reality-web-app-c2442e716564)<br>
[setAttribute function in Aframe](https://aframe.io/docs/0.9.0/introduction/javascript-events-dom-apis.html#adding-a-component-with-setattribute)<br>
[AFrame Toy Project](https://aframe.io/docs/1.6.0/guides/building-a-basic-scene.html)
