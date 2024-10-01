// Fetch the config file to dynamically load the GLTF models
fetch('../../config.json')
  .then(response => response.json())
  .then(config => {
    const models = config.gltfModels;
    const assetsContainer = document.getElementById('gltf-assets-container');

    // Dynamically create <a-asset-item> elements
    models.forEach(model => {
      const assetItem = document.createElement('a-asset-item');
      assetItem.setAttribute('id', model.id);
      assetItem.setAttribute('src', model.src);
      assetsContainer.appendChild(assetItem);
    });
  })
  .catch(error => {
    console.error('Error loading config:', error);
  });
