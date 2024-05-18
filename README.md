# hcm-generate-labels

### First
```bash
mkdir -p source/dist source/labels
```

### Exec

```bash
TABLE_NAME=xxxx node app.js
```

### Create Docker image

```bash
dck build -t hcm-generate-labels .
```

### Run

```bash
dck run -it --rm -e TABLE_NAME=xxxx \
  -v ./single/source:/home/node/source \
  hcm-generate-labels node app.js
```
