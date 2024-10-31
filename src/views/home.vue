<script setup>
    import { ref, onMounted } from 'vue';
    import api from '../api';

    const folders = ref([]);
    const files  = ref([]);

    const fetchDataFolders = async () => {

        //fetch data 
        await api.get('/api/folders')
        .then(response => {
            folders.value = response.data.data
        });
    }

    const fetchDataFiles = async(id) => {
        await api.get('/api/files', {
            params: {
                folder_id: id
            }
        })
        .then(response => {
            files.value = response.data.data
        });
    }

    onMounted(() => {
        fetchDataFolders();
    });

</script>

<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white">
                <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/"
                        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                        <span class="fs-5 d-none d-sm-inline">Explorer App</span>
                    </a>

                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start">
                        <span v-if="folders.length == 0">
                            <li class="nav-item">
                                <a href="#" class="nav-link align-middle px-0">
                                    <span class="ms-1 d-none d-sm-inline">Belum Ada Folder</span>
                                </a>
                            </li>
                        </span>

                        <span v-else v-for="(folder, index) in folders" :key="index">
                            <li class="nav-item" @click="fetchDataFiles(folder.id)" >
                                <a href="#" class="nav-link align-middle px-0">
                                    <font-awesome-icon icon="folder-open" /> 
                                    <span class="ms-1 d-none d-sm-inline">{{ folder.folder }}</span>
                                </a>
                            </li>
                        </span>
                    </ul>
                    <hr>
                </div>
            </div>

            <div class="row">
                <div class="py-3 card-group">
                    <!-- Files List -->
                    <span v-if="files.length == 0">
                        <h3>Tidak ada file</h3>
                    </span>
                    <span v-else v-for="(file, index) in files" :key="index" >
                        <span class="card m-2" style="width: 200px; height: 200px;">
                            <img class="card-img-top" :src="file.file_hash" alt="Image">
                            <div class="card-body bg-secondary">
                                <p class="card-text text-white" style="font-size: 12px;">{{ file.file }}</p>
                            </div>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>