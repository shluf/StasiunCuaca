package config

import (
	"context"
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var Cld *cloudinary.Cloudinary

func InitCloudinary() {
	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		log.Println("Warning: CLOUDINARY_URL not found, image upload will fail")
		return
	}

	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		log.Printf("Failed to initialize Cloudinary: %v", err)
		return
	}
	Cld = cld
}

func UploadImage(ctx context.Context, file interface{}, publicID string) (string, error) {
	if Cld == nil {
		return "", log.Output(1, "Cloudinary not initialized")
	}
	resp, err := Cld.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID: publicID,
		Folder:   "stasiuncuaca/news",
	})
	if err != nil {
		return "", err
	}
	return resp.SecureURL, nil
}
