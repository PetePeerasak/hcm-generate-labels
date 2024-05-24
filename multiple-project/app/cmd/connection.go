/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>

*/
package cmd

import (
	"fmt"
	"log"
	"io"

	"database/sql"
	"github.com/sijms/go-ora"
	"github.com/spf13/cobra"
)

// connectionCmd represents the connection command
var connectionCmd = &cobra.Command{
	Use:   "connection",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("connection called")

		// PORT := 1521
		// connStr := go_ora.BuildUrl("db.aws-dev.peopleplus.co.th", PORT, "HCM11", "ST11", "ST114487", nil)
		// conn, err := sql.Open("oracle", connStr)
		// // check for error
		// err = conn.Ping()

		// port := 2484
		// urlOptions := map[string] string {
		// 	"ssl": "true", // or enable
		// 	"ssl verify": "false", // stop ssl certificate verification
		// 	"wallet": "path to folder that contains oracle wallet",
		// }
		// connStr := go_ora.BuildUrl("server", port, "service_name", "username", "password", urlOptions)

		port := 1521
		urlOptions := map[string]string {
			"SID": "HCM11",
		}
		connStr := go_ora.BuildUrl("db.aws-dev.peopleplus.co.th", port, "", "ST11", "ST114487", urlOptions)
		conn, err := sql.Open("oracle", connStr)
		if err != nil {
			fmt.Println("1")
			log.Fatal(err)
		}

		// _, err = conn.Query("SELECT * FROM tapplscr where codapp like 'HRESH3X%'")
		_, err = conn.Query("SELECT * FROM tapplscr")
		// if err != nil {
		// 	fmt.Println("2")
		// 	log.Fatal(err.Error())
		// 	if err != nil {
		// 		fmt.Println("Error:", err)
		// }
		// }
		// if err != nil {
		// 	fmt.Println("Error:", err)
		// }
		// if err != nil {
		// 	if err == io.EOF {
		// 			fmt.Println("Error: End of file reached", err.Error())
		// 	} else {
		// 			fmt.Println("Error:", err)
		// 	}
		// }

		// // check for errors
		// defer rows.Close()

		// var (
		// 	codapp sql.NullString
		// )
		// for rows.Next() {
		// 	err = rows.Scan(&codapp)
		// 	// check for errors
		// 	if err != nil {
		// 		log.Fatal("rows.Scan",err)
		// 	}

		// 	fmt.Println("codapp", codapp)
		// }
	},
}


func init() {
	rootCmd.AddCommand(connectionCmd)
}
