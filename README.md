## Demo project for uploading a file

Demo of uploading a pdf file to aserver. Only runs locally.  Will return a dataset and show a frequency of words in the pdf.

### to get started


clone the repo
```
git clone https://github.com/willmac321/dideroDemo
```

#### install the frontend environment
- if npm and node are installed:
    ```
    cd ./fe
    npm i
    ```

#### install the backend environment
(I use virtual envs so going to include that here)
```
cd ./be

// virtualize and activate the venv
python -m venv ./.venv
source .venv/bin/activate

// install requirements
pip install -r requirements.txt
```

#### To run
in fe folder 
```
npm run dev
```

A webpage should open, if not navigate to `localhost:5173`

in be folder to run dev server
```
 python -m flask --app server --debug run
```


#### A few example photos
On Load
[landing image](landing.png)

On Select
[select image](select.png)

On Complete
[complete image](complete.png)
