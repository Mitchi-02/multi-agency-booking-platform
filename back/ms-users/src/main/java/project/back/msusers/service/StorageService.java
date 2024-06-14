package project.back.msusers.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.io.*;

@Service
@Slf4j
public class StorageService {

    @Value("${gcp.bucket_id}")
    private String bucket;

    private Storage storage;

    public static final String BASE_URL = "https://storage.googleapis.com/tripx-bucket/";
    public static final String DEFAULT_PHOTO = "users/default.png";
    public StorageService(
        @Value("${gcp.client_email}") String client_email, 
        @Value("${gcp.project_id}") String project_id,
        @Value("${gcp.client_id}") String client_id,
        @Value("${gcp.private_key_id}") String private_key_id,
        @Value("${gcp.private_key}") String private_key
    ){
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ByteArrayInputStream(
                    ("{\n" +
                     "  \"type\": \"service_account\",\n" +
                     "  \"project_id\": \"" + project_id + "\",\n" +
                     "  \"private_key_id\": \"" + private_key_id + "\",\n" +
                     "  \"private_key\": \"" + private_key + "\",\n" +
                     "  \"client_email\": \"" + client_email + "\",\n" +
                     "  \"client_id\": \"" + client_id + "\" \n" +
                     "}").getBytes(StandardCharsets.UTF_8)));

            StorageOptions options = StorageOptions.newBuilder().setCredentials(credentials).build();
            this.storage = options.getService();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public String save(String basePath, MultipartFile file) throws IOException{
        String[] split = file.getOriginalFilename().split("\\.");
        //add extension to uuid
        String path = basePath + UUID.randomUUID().toString() + "." + split[split.length - 1];
        storage.create(BlobInfo.newBuilder(bucket, path).build(), file.getBytes());
        return path;
    }

    public void delete(String path) {
        String temp = path.replace(BASE_URL, "");
        if (StorageService.DEFAULT_PHOTO.equals(temp)) return;
        storage.delete(bucket, path.replace(StorageService.BASE_URL, ""));
    }
}
