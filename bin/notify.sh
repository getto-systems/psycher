#!/bin/bash

result=$1

echo "$GETTO_PSYCHER_URL"
curl $GETTO_PSYCHER_URL?$GETTO_PSYCHER_TOKEN=true&source=gitlab&result=$result&channel=$channel&timestamp=$timestamp
