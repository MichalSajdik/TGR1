build:
	cp src/information.js informationCompile
	touch  information
	echo '#!/bin/bash' > information
	echo 'node' 'informationCompile' >> information
	chmod +x information
	cp src/fusion.js fusionCompile
	touch  fusion
	echo '#!/bin/bash' > fusion
	echo 'node' 'fusionCompile' >> fusion
	chmod +x fusion
	cp src/distribution.js distributionCompile
	touch  distribution
	echo '#!/bin/bash' > distribution
	echo 'node' 'distributionCompile' >> distribution
	chmod +x distribution
