# Hundred Meter Wood

A visualization comparing tree placement through random scattering vs Poisson-Disc sampling using A-Frame and D3.

## Description

The idea for this visualization came out of an old Gamasutra article titled ["Random Scattering: Creating Realistic Landscapes" by Mick West](http://www.gamasutra.com/view/feature/130071/random_scattering_creating_.php). The article discusses various ways to generate forests using 2D scatter plots for visuals. I thought it might be interesting to use 3D instead.

Viewing from above gives a similar 2D perspective while opening up the possibility of descending to the forest floor and walking around. Does one algorithm produce a more "natural" feeling forest?

Creating this visualization was a surprising amount of work--almost like creating a small game. Interface, performance, and visuals were particularly challenging. Initially a more realistic look was sought with high resolution textures and complex models, but performance limited the "forest" to about 18 trees. Texturing the ground in an appealing way was also hard. Ultimately, a simpler model was used and the general style made more cartoon-like.

### Random Scattering vs Poisson-Disc Sampling

>Poisson-disc sampling produces points that are tightly-packed, but no closer to each other than a specified minimum distance, resulting in a more natural pattern. - [Jason Davies](https://www.jasondavies.com/poisson-disc/)

It's interesting (for me at least) to see the differences between random scattering and Poisson-Disc sampling in this way. The strange clumping inherent to random numbers is easily seen walking through the forest. It is reflected in the odd, treeless spaces and the impossibly tight groupings that would starve trees in reality. Random scattering also causes unsightly [z-fighting](https://en.wikipedia.org/wiki/Z-fighting) between shadows while Poisson-Disc sampling ensures that this doesn't happen.

To be honest, this comparison is not rigorous. The number of trees generated by the two procedures is probably unequal and the Poisson-Disc radius is arbitrarily set to 8. I adjusted these values more for aesthetics than science. 

## References and Tools Used

- [A-Frame](https://aframe.io/)
- [D3](https://d3js.org/)
- [aframe-bmfont-text-component](https://github.com/bryik/aframe-bmfont-text-component)
- [aframe-mouse-cursor-component](https://github.com/mayognaise/aframe-mouse-cursor-component)
- [Poisson-Disc Sampling](http://bl.ocks.org/mbostock/19168c663618b7f07158) code was written by Mike Bostock (who based his work on Jason Davies’ implementation of Bridson’s algorithm)

General design taken from A-Frame logo example.

### Assets

Tree model taken from the [A-Frame repo](https://github.com/aframevr/aframe/tree/master/examples/assets/models/tree1).

All sounds were sourced from [The GameAudioGDCBundle Part 2](http://www.sonniss.com/gameaudiogdc2016/). The bird sounds were produced by George Vlad ([Woodland Atmosphere](http://www.sonniss.com/sound-effects/woodland-atmosphere/)). The rustling wind sound was produced by Pole Production Audio ([The Snow and Ice Textures Library](http://pole.se/product/the-snow-ice-textures-library/)).

## Running Locally

Install the Node dependencies:

    npm install

To serve the site from a simple Node development server:

    npm start

Then launch the site from your favourite browser:

[__http://localhost:3000/__](http://localhost:3000/)

If you wish to serve the site from a different port:

    PORT=8000 npm start

## License

This program is free software and is distributed under an [MIT License](LICENSE).
