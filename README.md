## This project is a image upload and processing system.

It started as a idea to upload profile pictures images to a storage system, this kind of profile picture upload can be extremely optimized there are three types of optimization in here:

- 1 Image compression.
- 2 Image cropping.
- 3 Image processing with aws lambda.

### Image compression + Image cropping.

When the user upload some image the image will be compressed to a 400x400 pixels and convert to format JPEG with a ppi (pixels per inch) of 75.

### Image processing

All of this happens inside a aws lambda function, this lambda function is written in rust and is optimized to work on a ARM processor.  
The choice for a lambda function is the ability to scale up or down depending on the demand.

The code of this lambra function is in this repository: [https://github.com/EduartePaiva/image-uploader-rust-lambda](https://github.com/EduartePaiva/image-uploader-rust-lambda)


## Things related to the gallery.

For the website gallery in the authentication part I used clerk, for the images they are loaded 10 images at a time using a technique of infinite scroll that will load more images as the user scrolls down.

For the database for storing images record I used a postgres product [cockroachDB](https://www.cockroachlabs.com/), they offer a pretty good free tier plan.

For storing and processing I'm using AWS


## Diagram of uploading one image:

![Upload image diagram](readme_assets/image_uploading_diagram.svg?raw=true "Title")