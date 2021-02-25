# Viking Ikea "Vikea"

> This service will serve up all the reviews for the requested item.

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Basic API usage:
 - For a summary: GET /api/reviews/:itemID
 - example responses based on item at https://www.ikea.com/us/en/p/hemnes-2-drawer-chest-black-brown-50242619/:
```JSON 

{
  "number": 479,
  "average": 4.4
}

```
 - For all details: GET /api/reviews/:itemID/details
 - 20 reviews will show per page.
 - Get other pages by eg. GET /api/reviews/:itemID/details?page=2
 - example response:
```JSON

{
  "averageRatings": {
    "number": 479,
    "overall": 4.4,
    "easeOfAssembly": 4.1,
    "valueForMoney": 4.4,
    "productQuality": 4.3,
    "appearance": 4.6,
    "worksAsExpected": 4.5
  },
  "page": {
    "number": 1,
    "outOf": 24
  },
  "customerReviews": [
    {
      "reviewID": 1,
      "name": "Carlos",
      "date": "02/22/2021",
      "title": "Good set",
      "reviewText": "Good set",
      "recommended": true,
      "overall": 5,
      "easeOfAssembly": 3,
      "valueForMoney": 5,
      "productQuality": 5,
      "appearance": 5,
      "worksAsExpected": 5
    },
    {
      "reviewID": 2,
      "name": "JANELEN",
      "date": "02/19/2021",
      "title": "Perfect for a guest bedroom",
      "reviewText": "Clean lines, drawers open easily and they look good.",
      "recommended": true,
      "overall": 5,
      "easeOfAssembly": 4,
      "valueForMoney": 5,
      "productQuality": 5,
      "appearance": 5,
      "worksAsExpected": 5
    },
    ...
  ]
}

```

 - For a single review: GET /api/reviews/:itemID/details/:reviewID
 - example response: 
```JSON

{
  "reviewID": 2,
  "name": "JANELEN",
  "date": "02/19/2021",
  "title": "Perfect for a guest bedroom",
  "reviewText": "Clean lines, drawers open easily and they look good.",
  "recommended": true,
  "overall": 5,
  "easeOfAssembly": 4,
  "valueForMoney": 5,
  "productQuality": 5,
  "appearance": 5,
  "worksAsExpected": 5
}

```

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

