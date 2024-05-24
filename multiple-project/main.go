package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

const (
	tableName = "HRBFLABEL"
	lang      = "en"
)

func main() {
	files, err := filepath.Glob("./source/labels/*.js")
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		b, err := ioutil.ReadFile(file)
		if err != nil {
			log.Fatal(err)
		}

		labels := make(map[string]map[string]string)
		if err := json.Unmarshal(b, &labels); err != nil {
			log.Fatal(err)
		}

		fileName := strings.TrimSuffix(filepath.Base(file), filepath.Ext(file))
		message := fmt.Sprintf("SET DEFINE OFF;\n")

		for label := range labels[lang] {
			message += fmt.Sprintf("DELETE FROM %s WHERE CODAPP='%s';\n", tableName, strings.ToUpper(label))
		}

		for fnName, values := range labels[lang] {
			for index, value := range values {
				message += fmt.Sprintf("INSERT INTO %s VALUES ('%s',%s,NULL,'%s','%s','%s','%s','%s',SYSDATE,NULL,SYSDATE,'TJS00001');\n",
					tableName,
					fnName,
					index,
					labels["en"][fnName][index],
					labels["th"][fnName][index],
					labels["103"][fnName][index],
					labels["104"][fnName][index],
					labels["105"][fnName][index],
				)
			}
		}

		message += "commit;\n"

		if err := ioutil.WriteFile(fmt.Sprintf("./source/dist/%s_a.sql", strings.ToLower(fileName)), []byte(message), os.ModePerm); err != nil {
			log.Fatal(err)
		}

		fmt.Printf("Result: %s -> ./source/dist/%s_a.sql\n", fileName, strings.ToLower(fileName))
	}
}

