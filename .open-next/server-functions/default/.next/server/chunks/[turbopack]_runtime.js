var RUNTIME_PUBLIC_PATH = "server/chunks/[turbopack]_runtime.js";
var RELATIVE_ROOT_PATH = "..";
var ASSET_PREFIX = "/";
// Apply forwarded globals from workerData if running in a worker thread
if (typeof require !== 'undefined') {
    try {
        var { workerData } = require('worker_threads');
        if (workerData?.__turbopack_globals__) {
            Object.assign(globalThis, workerData.__turbopack_globals__);
            // Remove internal data so it's not visible to user code
            delete workerData.__turbopack_globals__;
        }
    } catch (_) {
        // Not in a worker thread context, ignore
    }
}
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
/// <reference path="./async-module.ts" />
/**
 * Describes why a module was instantiated.
 * Shared between browser and Node.js runtimes.
 */ var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
/**
 * Flag indicating which module object type to create when a module is merged. Set to `true`
 * by each runtime that uses ModuleWithDirection (browser dev-base.ts, nodejs dev-base.ts,
 * nodejs build-base.ts). Browser production (build-base.ts) leaves it as `false` since it
 * uses plain Module objects.
 */ let createModuleWithDirectionFlag = false;
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        if (createModuleWithDirectionFlag) {
            // set in development modes for hmr support
            module = createModuleWithDirection(id);
        } else {
            module = createModuleObject(id);
        }
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
function createModuleWithDirection(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined,
        parents: [],
        children: []
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings, dynamic) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    // The properties defined above are already non-configurable and
    // non-writable, so the namespace's existing exports are effectively
    // immutable. Sealing additionally makes the object non-extensible, matching
    // real ESM-namespace semantics. Modules with dynamic re-exports
    // (`export *` from a CommonJS module) must stay extensible so the dynamic
    // export proxy can surface keys discovered at runtime, so skip the seal for
    // them.
    if (!dynamic) Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id, dynamic) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings, dynamic);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        // Returns the re-exported object that provides `prop` as an own property,
        // or `undefined` if none does. The traps share this logic so they always
        // agree on which keys are synthesized from `reexportedObjects`. `default`
        // is never re-exported by `export *`, so it is never synthesized.
        const reexportOwning = (prop)=>{
            if (prop !== 'default') {
                for (const obj of reexportedObjects){
                    if (hasOwnProperty.call(obj, prop)) return obj;
                }
            }
            return undefined;
        };
        // Modules with dynamic re-exports are not sealed by `esm()`, so the
        // target beneath the namespace stays extensible. That is what lets the
        // `ownKeys` and `getOwnPropertyDescriptor` traps legally report keys that
        // exist on `reexportedObjects` but not on the target itself.
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                const obj = reexportOwning(prop);
                return obj && Reflect.get(obj, prop);
            },
            // The namespace is read-only, like a real esm namespace object. The
            // re-exported modules can still mutate their own exports (exposed live
            // via `get`), but mutating the namespace itself is rejected. Refusing
            // here, rather than forwarding to the extensible target, also prevents an
            // assignment/definition from shadowing a dynamic re-export. It also
            // prevents delete from removing a static export.
            set () {
                return false;
            },
            defineProperty () {
                return false;
            },
            deleteProperty () {
                return false;
            },
            // The `has` trap ensures that `'exportName' in starImports` will reflect
            // the truth of whether a key is exported.
            has (target, prop) {
                if (Reflect.has(target, prop)) return true;
                if (prop === 'default' || prop === '__esModule') return false;
                return reexportOwning(prop) !== undefined;
            },
            // ownKeys and getOwnPropertyDescriptor together make the keys enumerable.
            // If a value is returned from `ownKeys` but its property descriptor is
            // not enumerable, it will not be visible to iterator methods.
            // Collectively, they allow code like the following:
            //
            // ```
            // // module.js re-exports dynamic CJS exports
            // export * from './legacyModule.cjs'
            //
            // // from another JS file, reference the re-exported dynamic values
            // import * as Namespace from './module.js'
            // Object.keys(Namespace)
            // ```
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            },
            getOwnPropertyDescriptor (target, prop) {
                const own = Reflect.getOwnPropertyDescriptor(target, prop);
                if (own || prop === 'default' || prop === '__esModule') return own;
                const obj = reexportOwning(prop);
                if (obj) {
                    // Synthetic keys don't exist on the target, so they MUST be
                    // reported as configurable. However the set/delete traps above will
                    // prevent them from actually being changed
                    return {
                        enumerable: true,
                        configurable: true,
                        get: ()=>Reflect.get(obj, prop)
                    };
                }
                return undefined;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Install the factory for each module ID that doesn't already have one.
        // When some IDs in this group already have a factory, reuse that existing
        // group factory for the missing IDs to keep all IDs in the group consistent.
        // Otherwise, install the factory from this chunk.
        const moduleFactoryFn = chunkModules[end];
        let existingGroupFactory = undefined;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            const existingFactory = moduleFactories.get(id);
            if (existingFactory) {
                existingGroupFactory = existingFactory;
                break;
            }
        }
        const factoryToInstall = existingGroupFactory ?? moduleFactoryFn;
        let didInstallFactory = false;
        for(let j = i; j < end; j++){
            const id = chunkModules[j];
            if (!moduleFactories.has(id)) {
                if (!didInstallFactory) {
                    if (factoryToInstall === moduleFactoryFn) {
                        applyModuleFactoryName(moduleFactoryFn);
                    }
                    didInstallFactory = true;
                }
                moduleFactories.set(id, factoryToInstall);
                newModuleId?.(id);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * Constructs an error message for when a module factory is not available.
 */ function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    let instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = `as a runtime entry of chunk ${sourceData}`;
            break;
        case 1:
            instantiationReason = `because it was required from module ${sourceData}`;
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
    }
    return `Module ${moduleId} was instantiated ${instantiationReason}, but the module factory is not available.`;
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/**
 * Returns an absolute `file://` URL for the given module path.
 *
 * Uses `url.pathToFileURL` so that the resulting URL is a valid file URI on
 * all platforms (forward slashes on Windows, drive letters handled
 * correctly, path segments URL-encoded).
 */ function resolveFileUrl(modulePath) {
    return require('url').pathToFileURL(resolveAbsolutePath(modulePath)).href;
}
Context.prototype.F = resolveFileUrl;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../shared/runtime/runtime-utils.ts" />
/// <reference path="../../shared-node/base-externals-utils.ts" />
/// <reference path="../../shared-node/node-externals-utils.ts" />
/// <reference path="./nodejs-globals.d.ts" />
/**
 * Base Node.js runtime shared between production and development.
 * Contains chunk loading, module caching, and other non-HMR functionality.
 */ process.env.TURBOPACK = '1';
const url = require('url');
const moduleFactories = new Map();
const moduleCache = Object.create(null);
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
/**
 * Exports a URL value. No suffix is added in Node.js runtime.
 */ function exportUrl(urlValue, id) {
    exportValue.call(this, urlValue, id);
}
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
    loadedChunks.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
// Shared runtime primitive: the root that on-disk chunk paths are resolved
// against. Used by the bundled wasm helper (exposed as `__turbopack_runtime_root__`).
contextPrototype.w = RUNTIME_ROOT;
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-base.ts" />
/**
 * Production Node.js runtime.
 * Uses ModuleWithDirection and simple module instantiation without HMR support.
 */ // moduleCache and moduleFactories are declared in runtime-base.ts
// this is read in runtime-utils.ts so it creates a module with direction for hmr
createModuleWithDirectionFlag = true;
const nodeContextPrototype = Context.prototype;
nodeContextPrototype.q = exportUrl;
nodeContextPrototype.M = moduleFactories;
// Cast moduleCache to ModuleWithDirection for production mode
nodeContextPrototype.c = moduleCache;
nodeContextPrototype.R = resolvePathFromModule;
nodeContextPrototype.C = clearChunkCache;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData));
    }
    const module1 = createModuleWithDirection(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    ;
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__09bjnag._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__09bjnag._.js");
      case "server/chunks/ssr/[root-of-the-server]__0j26pto._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0j26pto._.js");
      case "server/chunks/ssr/[root-of-the-server]__0w--32e._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0w--32e._.js");
      case "server/chunks/ssr/[root-of-the-server]__0y_e9do._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0y_e9do._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_0k6o19a._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0k6o19a._.js");
      case "server/chunks/ssr/_0t-q39q._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0t-q39q._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_0pt47yr.js");
      case "server/chunks/ssr/node_modules_1nkgb45._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_1nkgb45._.js");
      case "server/chunks/ssr/node_modules_next_dist_1c5ky4f._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1c5ky4f._.js");
      case "server/chunks/ssr/node_modules_next_dist_1n3w9lb._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_1n3w9lb._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_0wpq8j3._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_1bi5-b2._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_1bi5-b2._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_0symwr9.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_0l_sp0x.js");
      case "server/chunks/ssr/src_lib_utils_ts_02vl9dh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/src_lib_utils_ts_02vl9dh._.js");
      case "server/chunks/[root-of-the-server]__0l3yhx4._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__0l3yhx4._.js");
      case "server/chunks/[root-of-the-server]__17_wvnd._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__17_wvnd._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_next-internal_server_app_api_sitemap_json_route_actions_0ncy-jh.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_sitemap_json_route_actions_0ncy-jh.js");
      case "server/chunks/[externals]__0l8ei7u._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[externals]__0l8ei7u._.js");
      case "server/chunks/_0uxp3uh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_0uxp3uh._.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_0g2jjls.js");
      case "server/chunks/[root-of-the-server]__1xz7iux._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1xz7iux._.js");
      case "server/chunks/_next-internal_server_app_feed_xml_route_actions_0mikpq1.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_feed_xml_route_actions_0mikpq1.js");
      case "server/chunks/ssr/[root-of-the-server]__1o8jotz._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1o8jotz._.js");
      case "server/chunks/ssr/_0wf1g-2._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0wf1g-2._.js");
      case "server/chunks/ssr/_next-internal_server_app_page_actions_0hhsz1j.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_page_actions_0hhsz1j.js");
      case "server/chunks/ssr/node_modules_framer-motion_dist_es_render_components_motion_proxy_mjs_1hcb7fs._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_framer-motion_dist_es_render_components_motion_proxy_mjs_1hcb7fs._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0q-w892.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_0q-w892.js");
      case "server/chunks/[root-of-the-server]__1q16vuw._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1q16vuw._.js");
      case "server/chunks/_next-internal_server_app_robots_txt_route_actions_15vc_89.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_robots_txt_route_actions_15vc_89.js");
      case "server/chunks/ssr/[root-of-the-server]__0e5parg._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e5parg._.js");
      case "server/chunks/ssr/_next-internal_server_app_sitemap_page_actions_0p8zzks.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_sitemap_page_actions_0p8zzks.js");
      case "server/chunks/[root-of-the-server]__14-ejgh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__14-ejgh._.js");
      case "server/chunks/_next-internal_server_app_sitemap-video_xml_route_actions_1x8qh33.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_sitemap-video_xml_route_actions_1x8qh33.js");
      case "server/chunks/[root-of-the-server]__1wa8ekk._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1wa8ekk._.js");
      case "server/chunks/_next-internal_server_app_sitemap_xml_route_actions_05l5km9.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_sitemap_xml_route_actions_05l5km9.js");
      case "server/chunks/ssr/[root-of-the-server]__0tq-jsm._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0tq-jsm._.js");
      case "server/chunks/ssr/_1uzal-g._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1uzal-g._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_captcha_page_actions_0gsret4.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_captcha_page_actions_0gsret4.js");
      case "server/chunks/ssr/[root-of-the-server]__1qgsxtn._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1qgsxtn._.js");
      case "server/chunks/ssr/_10i3iml._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_10i3iml._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_flaky_page_actions_1-31g_u.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_flaky_page_actions_1-31g_u.js");
      case "server/chunks/ssr/[root-of-the-server]__1_0-p8l._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1_0-p8l._.js");
      case "server/chunks/ssr/_1nav0gc._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1nav0gc._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_gpu_page_actions_1cxqn7i.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_gpu_page_actions_1cxqn7i.js");
      case "server/chunks/ssr/[root-of-the-server]__1-b50id._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-b50id._.js");
      case "server/chunks/ssr/_1ohwa0z._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1ohwa0z._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_high-failure_page_actions_1rnc1_p.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_high-failure_page_actions_1rnc1_p.js");
      case "server/chunks/ssr/[root-of-the-server]__1fjv76_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1fjv76_._.js");
      case "server/chunks/ssr/_0gh5sv_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0gh5sv_._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_oom_page_actions_197fqxl.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_oom_page_actions_197fqxl.js");
      case "server/chunks/ssr/[root-of-the-server]__0czexge._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0czexge._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_page_actions_1ajjuov.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_page_actions_1ajjuov.js");
      case "server/chunks/ssr/src_lib_utils_ts_0m4hn6s._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/src_lib_utils_ts_0m4hn6s._.js");
      case "server/chunks/ssr/[root-of-the-server]__15rbck1._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__15rbck1._.js");
      case "server/chunks/ssr/_0g80ubq._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0g80ubq._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_popup_page_actions_014k9gr.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_popup_page_actions_014k9gr.js");
      case "server/chunks/ssr/[root-of-the-server]__1nubi63._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1nubi63._.js");
      case "server/chunks/ssr/_0iqmkpi._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0iqmkpi._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_recursive_page_actions_1n44t4i.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_recursive_page_actions_1n44t4i.js");
      case "server/chunks/ssr/[root-of-the-server]__0vg8bjj._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0vg8bjj._.js");
      case "server/chunks/ssr/_1lkd9nk._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1lkd9nk._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_chaos_tracking_page_actions_14xef6g.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_chaos_tracking_page_actions_14xef6g.js");
      case "server/chunks/ssr/[root-of-the-server]__1vks1pl._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1vks1pl._.js");
      case "server/chunks/ssr/_08dl9wm._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_08dl9wm._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_defenses_fingerprint_page_actions_1-2k402.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_defenses_fingerprint_page_actions_1-2k402.js");
      case "server/chunks/ssr/[root-of-the-server]__1iayxlz._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1iayxlz._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_defenses_page_actions_1zagmdv.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_defenses_page_actions_1zagmdv.js");
      case "server/chunks/ssr/[root-of-the-server]__1-4gzw3._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1-4gzw3._.js");
      case "server/chunks/ssr/_0i08n99._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0i08n99._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_defenses_rate-limit_page_actions_02fp8x6.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_defenses_rate-limit_page_actions_02fp8x6.js");
      case "server/chunks/ssr/[root-of-the-server]__1ve7n-i._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1ve7n-i._.js");
      case "server/chunks/ssr/_1xranjg._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1xranjg._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_defenses_waf_page_actions_1higqho.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_defenses_waf_page_actions_1higqho.js");
      case "server/chunks/ssr/[root-of-the-server]__10_hau8._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__10_hau8._.js");
      case "server/chunks/ssr/_01djdde._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_01djdde._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_infinite-scroll_page_actions_10a8o-m.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_infinite-scroll_page_actions_10a8o-m.js");
      case "server/chunks/ssr/[root-of-the-server]__1oiwyz4._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1oiwyz4._.js");
      case "server/chunks/ssr/_1zt70at._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1zt70at._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_live_page_actions_0fkovm0.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_live_page_actions_0fkovm0.js");
      case "server/chunks/ssr/[root-of-the-server]__06y8rx6._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__06y8rx6._.js");
      case "server/chunks/ssr/_0dfzru-._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0dfzru-._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_mismatch_page_actions_1si56gb.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_mismatch_page_actions_1si56gb.js");
      case "server/chunks/ssr/[root-of-the-server]__1kgcpxh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1kgcpxh._.js");
      case "server/chunks/ssr/_0zcirfa._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0zcirfa._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_no-load_page_actions_1pjk35x.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_no-load_page_actions_1pjk35x.js");
      case "server/chunks/ssr/[root-of-the-server]__1p7lfih._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1p7lfih._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_page_actions_20zq2_9.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_page_actions_20zq2_9.js");
      case "server/chunks/ssr/[root-of-the-server]__0h_z533._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0h_z533._.js");
      case "server/chunks/ssr/_15tt1rf._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_15tt1rf._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_pagination_page_actions_0c7327g.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_pagination_page_actions_0c7327g.js");
      case "server/chunks/ssr/[root-of-the-server]__1o7rnd8._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1o7rnd8._.js");
      case "server/chunks/ssr/_1l-qp5e._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1l-qp5e._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dom_shadow_page_actions_0edcakx.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dom_shadow_page_actions_0edcakx.js");
      case "server/chunks/ssr/[root-of-the-server]__0rjho8m._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0rjho8m._.js");
      case "server/chunks/ssr/_06vvzu6._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_06vvzu6._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_content-shift_page_actions_02f4l72.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_content-shift_page_actions_02f4l72.js");
      case "server/chunks/ssr/[root-of-the-server]__1x8kekr._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1x8kekr._.js");
      case "server/chunks/ssr/_0voam-v._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0voam-v._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_cookie_page_actions_1u6dbvc.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_cookie_page_actions_1u6dbvc.js");
      case "server/chunks/ssr/[root-of-the-server]__05gjp38._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__05gjp38._.js");
      case "server/chunks/ssr/_14z_7cu._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_14z_7cu._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_delayed_page_actions_18fsywj.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_delayed_page_actions_18fsywj.js");
      case "server/chunks/ssr/[root-of-the-server]__0ytf5rk._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ytf5rk._.js");
      case "server/chunks/ssr/_0yso1dh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0yso1dh._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_hidden_page_actions_0scgf_7.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_hidden_page_actions_0scgf_7.js");
      case "server/chunks/ssr/[root-of-the-server]__0quepn9._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0quepn9._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_page_actions_1h4upm2.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_page_actions_1h4upm2.js");
      case "server/chunks/ssr/[root-of-the-server]__1j43qj6._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1j43qj6._.js");
      case "server/chunks/ssr/_1d812ea._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1d812ea._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_shifting_page_actions_1b2tjq9.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_shifting_page_actions_1b2tjq9.js");
      case "server/chunks/ssr/[root-of-the-server]__0e07hvd._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e07hvd._.js");
      case "server/chunks/ssr/_0q5mgi_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0q5mgi_._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_dynamic_state_page_actions_00s06x6.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_dynamic_state_page_actions_00s06x6.js");
      case "server/chunks/ssr/[root-of-the-server]__1et7y_f._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1et7y_f._.js");
      case "server/chunks/ssr/_0qytu27._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0qytu27._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_loop_page_actions_1rtrubr.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_loop_page_actions_1rtrubr.js");
      case "server/chunks/ssr/[root-of-the-server]__1xjbabj._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1xjbabj._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_page_actions_0l0h-fp.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_page_actions_0l0h-fp.js");
      case "server/chunks/ssr/[root-of-the-server]__0tu7vm7._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0tu7vm7._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_external_page_actions_0728d9-.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_external_page_actions_0728d9-.js");
      case "server/chunks/ssr/node_modules_next_dist_0drixxt._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_0drixxt._.js");
      case "server/chunks/ssr/[root-of-the-server]__00uo_6u._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__00uo_6u._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_page_actions_02we8s2.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_page_actions_02we8s2.js");
      case "server/chunks/ssr/[root-of-the-server]__1j1ljce._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1j1ljce._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-2_page_actions_1jcca-o.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-2_page_actions_1jcca-o.js");
      case "server/chunks/ssr/[root-of-the-server]__0u6k5lm._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0u6k5lm._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-3_page_actions_0t014a_.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-3_page_actions_0t014a_.js");
      case "server/chunks/ssr/[root-of-the-server]__11-nqhx._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11-nqhx._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-4_page_actions_19a_18k.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_step-4_page_actions_19a_18k.js");
      case "server/chunks/ssr/[root-of-the-server]__0yixhki._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0yixhki._.js");
      case "server/chunks/ssr/_1koe-9e._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1koe-9e._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_redirect_success_page_actions_0_mp0oc.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_redirect_success_page_actions_0_mp0oc.js");
      case "server/chunks/ssr/[root-of-the-server]__04thahr._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__04thahr._.js");
      case "server/chunks/ssr/_0n6iqys._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0n6iqys._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_slow_page_actions_0b_l5vk.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_slow_page_actions_0b_l5vk.js");
      case "server/chunks/ssr/[root-of-the-server]__1i61y8i._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1i61y8i._.js");
      case "server/chunks/ssr/_0-d82-m._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_0-d82-m._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_http_ui_[status]_page_actions_0p-lgpo.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_http_ui_[status]_page_actions_0p-lgpo.js");
      case "server/chunks/ssr/[root-of-the-server]__1f89og_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f89og_._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_brightcove_page_actions_15tv_vx.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_brightcove_page_actions_15tv_vx.js");
      case "server/chunks/ssr/[root-of-the-server]__1cr7qzd._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1cr7qzd._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_dailymotion_page_actions_0omaos8.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_dailymotion_page_actions_0omaos8.js");
      case "server/chunks/ssr/[root-of-the-server]__0mrwkow._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0mrwkow._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_instagram_page_actions_1ktxy19.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_instagram_page_actions_1ktxy19.js");
      case "server/chunks/ssr/[root-of-the-server]__184p1j0._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__184p1j0._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_jwplayer_page_actions_060drp2.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_jwplayer_page_actions_060drp2.js");
      case "server/chunks/ssr/[root-of-the-server]__16ht7uo._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__16ht7uo._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_kaltura_page_actions_01a5o4j.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_kaltura_page_actions_01a5o4j.js");
      case "server/chunks/ssr/[root-of-the-server]__0g853ci._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0g853ci._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_mixed_page_actions_0jdkhra.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_mixed_page_actions_0jdkhra.js");
      case "server/chunks/ssr/[root-of-the-server]__0nmxijz._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0nmxijz._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_native_page_actions_02l_h77.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_native_page_actions_02l_h77.js");
      case "server/chunks/ssr/[root-of-the-server]__11sqbws._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11sqbws._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_page_actions_0l7vv4t.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_page_actions_0l7vv4t.js");
      case "server/chunks/ssr/[root-of-the-server]__0ejuscw._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ejuscw._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_soundcloud_page_actions_0hhi1zd.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_soundcloud_page_actions_0hhi1zd.js");
      case "server/chunks/ssr/[root-of-the-server]__12zz-n3._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__12zz-n3._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_tiktok_page_actions_15tyzny.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_tiktok_page_actions_15tyzny.js");
      case "server/chunks/ssr/[root-of-the-server]__0v-rnmc._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0v-rnmc._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_twitch_page_actions_08dl1xq.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_twitch_page_actions_08dl1xq.js");
      case "server/chunks/ssr/[root-of-the-server]__0s29i7h._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0s29i7h._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_vault_page_actions_04z-lt-.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_vault_page_actions_04z-lt-.js");
      case "server/chunks/ssr/[root-of-the-server]__1r6emoh._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1r6emoh._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_vimeo_page_actions_0vstb6t.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_vimeo_page_actions_0vstb6t.js");
      case "server/chunks/ssr/[root-of-the-server]__0zm10i_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0zm10i_._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_media_wistia_page_actions_0uvlhny.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_media_wistia_page_actions_0uvlhny.js");
      case "server/chunks/ssr/[root-of-the-server]__18fn50u._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__18fn50u._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_runtime_page_actions_1b8hiu6.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_runtime_page_actions_1b8hiu6.js");
      case "server/chunks/ssr/[root-of-the-server]__12etaqf._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__12etaqf._.js");
      case "server/chunks/ssr/_03qh4rx._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_03qh4rx._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_runtime_service-worker_page_actions_0fkdeit.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_runtime_service-worker_page_actions_0fkdeit.js");
      case "server/chunks/ssr/[root-of-the-server]__1suz1na._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1suz1na._.js");
      case "server/chunks/ssr/_1c6us_-._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1c6us_-._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_runtime_web-worker_page_actions_1hyq47y.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_runtime_web-worker_page_actions_1hyq47y.js");
      case "server/chunks/ssr/[root-of-the-server]__1bap5kd._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1bap5kd._.js");
      case "server/chunks/ssr/_1f696yw._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_1f696yw._.js");
      case "server/chunks/ssr/_next-internal_server_app_test_runtime_websocket_page_actions_0kttp15.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_test_runtime_websocket_page_actions_0kttp15.js");
      case "server/chunks/ssr/[root-of-the-server]__13igkx_._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__13igkx_._.js");
      case "server/chunks/ssr/[root-of-the-server]__1f2jx51._.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1f2jx51._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js": return require("C:/work/test-website/test-website/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_0zi5s8-.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }


  async function loadWasmChunk(chunkPath) {
    switch (chunkPath) {

      default:
        throw new Error(`Unknown wasm chunk: ${chunkPath}`);
    }
  }
