#!/usr/bin/env bash

mkdir tmp > /dev/null 2>&1

# Download and unpack WordPress.
curl -L http://api.wordpress.org/core/version-check/1.7/ -o ./tmp/wp-latest.json
grep '[0-9]+\.[0-9]+(\.[0-9]+)?' ./tmp/wp-latest.json
LATEST_VERSION=$(grep -o '"version":"[^"]*' ./tmp/wp-latest.json | sed 's/"version":"//')

rm -Rf wordpress && rm -Rf tmp/wordpress-develop-$LATEST_VERSION > /dev/null 2>&1
curl -L "https://wordpress.org/wordpress-$LATEST_VERSION.zip" -o ./tmp/latest.zip
unzip -q ./tmp/latest.zip -d ./tmp
mkdir -p wordpress/src
mv ./tmp/wordpress/* wordpress/src

# Create the upload/wp-config.php directory with permissions that Travis can handle.
mkdir -p wordpress/src/wp-content/uploads
chmod -R 767 wordpress

# Grab the tools we need for WordPress' local-env.
curl -L "https://github.com/WordPress/wordpress-develop/archive/$LATEST_VERSION.zip" -o ./tmp/wordpress-develop.zip
unzip -q ./tmp/wordpress-develop.zip -d ./tmp
mv \
./tmp/wordpress-develop-$LATEST_VERSION/tools \
./tmp/wordpress-develop-$LATEST_VERSION/tests \
./tmp/wordpress-develop-$LATEST_VERSION/.env \
./tmp/wordpress-develop-$LATEST_VERSION/docker-compose.yml \
./tmp/wordpress-develop-$LATEST_VERSION/wp-cli.yml \
./tmp/wordpress-develop-$LATEST_VERSION/*config-sample.php \
./tmp/wordpress-develop-$LATEST_VERSION/package.json wordpress
