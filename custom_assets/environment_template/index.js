import * as THREE from 'three';
import metaversefile from 'metaversefile';

const { useApp, useLoaders, usePhysics , useCleanup } = metaversefile;
const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');


export default e => {
    const app = useApp();
    const physics = usePhysics();
    let physicsIds = [];

    (async () => {
        const u = `${baseUrl}/assets/scene.glb`; // must prefix "/bride-game" when working locally
        let gltf = await new Promise((accept, reject) => {
            const {gltfLoader} = useLoaders();
            gltfLoader.load(u, accept, function onprogress() {}, reject);        
        });

        app.add(gltf.scene);

        app.traverse(o => {
          if (o.name === "floor") {
            o.material = new THREE.MeshToonMaterial({ color : new THREE.Color("yellow")})
          }
            o.castShadow = true;
          });

        const physicsId = physics.addGeometry(gltf.scene);
        physicsIds.push(physicsId);
        app.updateMatrixWorld();

         })();

    useCleanup(() => {
        for (const physicsId of physicsIds) {
          physics.removeGeometry(physicsId);
        }
      });

      
    return app;
}