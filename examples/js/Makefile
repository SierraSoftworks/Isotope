all: clean deps

clean:
	rm -Rf ./node_modules

deps: deps_all deps_voices deps_presentation

deps_all:
	npm install
    
deps_voices:
    cd voices
    npm install
    
deps_presentation:
    cd presentation
    npm install