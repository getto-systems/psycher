#!/bin/bash

result=$1

curl $GETTO_PSYCHER_URL?$GETTO_PSYCHER_TOKEN=true&source=gitlab&result=$result&channel=$channel&timestamp=$timestamp
