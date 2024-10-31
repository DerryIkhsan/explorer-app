<script setup>
    import { ref, onMounted } from 'vue';
    import api from '../api';

    const folders = ref([]);

    const fetchDataFolders = async () => {

        //fetch data 
        await api.get('/api/folders')

        .then(response => {
            folders.value = response.data.data
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
                            <li class="nav-item">
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

            <div class="col py-3">
                Content area...
            </div>
        </div>
    </div>
</template>