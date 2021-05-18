/**
 * BadLads plugin import function signatures. The current plugin BadLads plugin implementation lacks any runtime event registartion... 
 * it simply scans the WASM for matching event signatures and ticks them off. The scan is done on plugin load/hot-reload. 
 * These cannot have an outer namespace/scope, must be defined on the global scope aka "". If you don't know what that means -- don't worry about it.
 * 
 * ```typescript
 * export function onPluginStop(pluginId: i32): void {} 
 * export function onPluginStart(pluginId: i32): void {}
 * export function onPluginTick(deltaTime: f64): void {}
 * export function onPlayerLogin(playerState: BadLadsObject): void {}
 * export function onPlayerLogout(playerState: BadLadsObject): void {}
 * export function onPlayerChatMessage(playerState: BadLadsObject, messageBuffer: ArrayBuffer, channel_index: i32): bool {return true;}
 * export function onLivingDeath(victim: BadLadsObject, killerPlayerState: BadLadsObject): void {}
 * export function onBecomeJob(playerState: BadLadsObject, jobName: ArrayBuffer): void {}
 * ```
 * 
 * Some comments are written as an implementation guide for other languages.  
 **/
export declare type HOVER_OVER_ME_README = bool;

/**
 * A BadLads Object id (64 bit unsigned integer). Consists of a pointer like id that the host uses for object lookups. 
 * The first 32 starting bits are reserved for the object search flags (8 bits from the beginning), the next 32 bits represent the actual object id.
 * Internally BadLads uses object hash buckets to lookup an object, this means object lookups are quite fast.
 */
export declare type BadLadsObject = u64;

// === Start Host function signatures === 
// Do not use these. Use the function wrappers below.
export declare function __hostPostPlayerChatMessage(playerState: BadLadsObject, string_ptr: ArrayBuffer, num_char: i32, color: i32, isServerMessage: bool): void
export declare function __hostPostGlobalChatMessage(string_ptr: ArrayBuffer, num_char: i32, color: i32, isServerMessage: bool): void
export declare function __hostGetObjectIdsOwnedUInt64s(objectTypeFlags: u32) : ArrayBuffer;

/**
 * Function suffixed with `Owned` mean we own that pointer and are responsible for it's deletion. Owned types are usually ArrayBuffers.
 */
export declare function __hostGetBadLadsVersionOwnedString() : ArrayBuffer;
export declare function __hostGetObjectClassNameOwnedString(objectTypeFlag: u32): ArrayBuffer;
export declare function __hostGetObjectTranformOwnedF32s(object: BadLadsObject) : ArrayBuffer;
export declare function __hostGetObjectBoundsOwnedF32s(object: BadLadsObject): ArrayBuffer;
export declare function __hostGetPlayerNameOwnedString(playerState: BadLadsObject): ArrayBuffer;
export declare function __hostGetPlayerJobOwnedString(playerState: BadLadsObject): ArrayBuffer;

export declare function __hostSetObjectTransform(object: BadLadsObject, x: f32, y: f32, z: f32, 
    pitch: f32, yaw: f32, roll: f32, scaleX: f32, scaleY: f32, scaleZ: f32) : bool;
export declare function __hostSetObjectHealth(object: BadLadsObject, NewHealth: i32): bool;
export declare function __hostSpawnObject(objectTypeFlag: u32, objectId: u32, asyncSpawn: bool,  x: f32, y: f32, z: f32, 
    pitch: f32, yaw: f32, roll: f32, scaleX: f32, scaleY: f32, scaleZ: f32): BadLadsObject;
export declare function __hostGetPlayerAccountId(playerState: BadLadsObject): u64;
export declare function __hostKickPlayerAccountId(playerAccountId: u64) : bool;
export declare function __hostBanPlayerAccountId(playerAccountId: u64) : BadLadsBanReply;
export declare function __hostUnbanPlayerAccountId(playerAccountId: u64) : bool;
export declare function __hostIsPlayerAccountIdBanned(playerAccountId: u64): bool;
export declare function __hostSetDoorState(estateObject: BadLadsObject, stateAndSide: i32): bool;
export declare function __hostGetEstateBuildableObjectsUInt64s(estateVolume: BadLadsObject): ArrayBuffer;
export declare function __hostGivePlayerStateItem(playerStateObject: BadLadsObject, itemId: i32, stackSize: i32, autoStack: bool): bool;
export declare function __hostSetPlayerJob(playerState: BadLadsObject, jobName: ArrayBuffer, jobNameLength: u32, bBroadcastBecome: bool, 
    bCheckForAvailability: bool, bTryRespawn: bool, bWasDemoted: bool, bForceRespawn: bool): bool;
export declare function __hostIsObjectValid(object: BadLadsObject): bool;
export declare function __hostGetPlayerStateCharacter(playerState: BadLadsObject): BadLadsObject;
export declare function __hostRaytrace(ignoredObject: BadLadsObject, collisionChannel: i32, startX: f32, startY: f32, startZ: f32, endX: f32, endY: f32, endZ: f32): f32
export declare function __hostGetGameTime(): f64;
export declare function __hostGetEconomyCurrencyValue(): f32;


// The three functions below are responsible for guest memory allocation. We allocate a piece of memory when we want to pass a string or any kind of buffer to the guest (us).
// !!! @fixme: These are commented out because AssemblyScript doesn't have a way to force export functions. 
// As a workaround we we rely on the `--exportRuntime` config setting for now. We want to export the three functions below so the user doesn't have to add `--exportRuntime`. 
//
// tldr: implement `__new(numBytes: i32, classId: i32): i32`, `__pin(pointer: i32): i32`, `__unpin(pointer: i32): void` in your languages implementation.

// //@ts-ignore
// export function __guest_alloc(numBytes: i32, classId: i32): i32 {
//     // The classId is not used at the moment, you can safely ignore it in the implementation.
//     //@ts-ignore
//     return __new(numBytes, classId);
// };

// // When implementing in another language, `__guest_pin` can safely be ignored as it's only relevant when GC is around.
// //@ts-ignore
// export function __guest_pin(pointer: i32): i32 {
//     //@ts-ignore
//     return __pin(pointer);
// };

// //@ts-ignore
// export function __guest_free(pointer: i32): void {
//     //@ts-ignore
//     __unpin(pointer);
// };


// === End host function signatures. ===

/**
 * Generic 3 dimensional vector class, no vector math has been implemented.
 * Up is +z
 */
export class Vector {
    x: f32;
    y: f32;
    z: f32;

    constructor(x: f32, y: f32, z: f32) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString(): string {
        return `(x: ${this.x}, y: ${this.y}, z: ${this.z})`
    }

    static ONE: Vector = new Vector(1, 1, 1);
    static ZERO: Vector = new Vector(0, 0, 0);
}


/**
 * Generic rotation class, roll, yaw pitch. Doesn't handle gimbal lock.
 */
export class Rotation {
    pitch: f32;
    yaw: f32;
    roll: f32;

    constructor(pitch: f32, yaw: f32, roll: f32) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.roll = roll;
    }

    toString(): string {
        return `(pitch: ${this.pitch}, yaw: ${this.yaw}, roll: ${this.roll})`
    }

    static ZERO: Rotation = new Rotation(0, 0, 0);
}

/**
 * A generic Trasnform most commonly used for objects in BadLads. Consists of a position vector, rotation vector and a scale vector.
 */
export class Transform {
    position: Vector;
    rotation: Rotation;
    scale: Vector

    constructor(position: Vector, rotation: Rotation, scale: Vector) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    toString(): string {
        return `(position: ${this.position}, rotation: ${this.rotation}, scale: ${this.scale})`
    }

    static IDENTITY: Transform = new Transform(Vector.ZERO, Rotation.ZERO, Vector.ONE);
}

export enum BadLadsBanReply {
    Banned,
	AlreadyBanned,
	InvalidPlayerId,
}

/**
 * BadLadsObjectFlags, most commonly used to search for a particular object type.
 * ```typescript
 * // Single object flag.
 * const onlyVehiclesFlags = BadLadsObjectFlags.Vehicles;
 * // Multiple object flag.
 * const vehiclesAndBuildablesFlags = BadLadsObjectFlags.Vehicles | BadLadsObjectFlags.Buildables;
 * ```
 */
export enum BadLadsObjectFlags {
    None                = 0,
    // PlayerStates hold player information, they spawn the entire connection of a player, independent from the controlled object.
	PlayerStates        = 1 << 1,
    // PlayerCharacters are just that, player characters. Each player has one, they can become invalid when player dies. A new one is assigned on spawn.
	PlayerCharacters    = 1 << 2,
	Vehicles            = 1 << 3,
    // Estate volumes are build volumes that own everything inside of them. They own Doors, Buildables, Alarms.
    // There can be more than 1 estate volume per building. You can check whether a player is in a estate volume by checking bounds intersections.
    // Bounds can be got through getObjectBounds
	EstateVolumes       = 1 << 4,
    // Estate objects are things like doors, elevators and alarms.
	EstateObjects	    = 1 << 5,
	Buildables          = 1 << 6,
	All                 = u8.MAX_VALUE
}

export enum BadLadsCollisionChannel {
    WorldStatic,
    WorldDynamic,
    PlayerObjects,
    Visibility,
    Camera,
    PhysicsBody,
    Destructible,
    __Unused01,
    __Unused02,
    __Unused03,
    __Unused04,
    __Unused05,
    __Unused06,
    Interactable,
    Hitscan
}

/**
 * A generic color class, internally represented as three unsigned 8 bit integers. (0-255, 0-255, 0-255)
 */
export class Color {
    r: u8;
    g: u8;
    b: u8

    constructor(R: u8, G: u8, B: u8) {
        this.r = R;
        this.g = G;
        this.b = B;
    }

    // @ts-ignore
    @inline
    toPackedBGR(): i32 {
        return i32(this.b) << 24 | i32(this.g) << 16 | i32(this.r << 8);
    }

    toString(): string {
        return `(r: ${this.r}, g: ${this.g}, b: ${this.b})`
    }

    static WHITE: Color = new Color(255, 255, 255);
    static BLACK: Color = new Color(0, 0, 0);
    static RED: Color = new Color(255, 0, 0);
    static GREEN: Color = new Color(0, 255, 0);
    static BLUE: Color = new Color(0, 0, 255);
};

/**
 * Returns a PlayerCharacter object from a given PlayerState object.
 * @param playerState 
 * @returns 
 */
// @ts-ignore
@inline
export function getPlayerCharacter(playerState: BadLadsObject): BadLadsObject {
    return __hostGetPlayerStateCharacter(playerState);
}

/**
 * Check if the given object is valid. Works on all object types.
 * e.g. you can use this to check whether a player is still alive by checking their PlayerCharacter validity. 
 * @param object 
 * @returns 
 */
// @ts-ignore
@inline
export function isObjectValid(object: BadLadsObject): bool {
    if(object != 0) {
        return __hostIsObjectValid(object);
    }
    return false;
}

/**
 * Post a global chat message.
 * @param messageString 
 * @param color 
 * @param isEventful Eventful messages appear on the players notification bar.
 */
// @ts-ignore
@inline
export function postGlobalChatMessage(messageString: string, color: Color = Color.WHITE, isEventful: bool = false): void {
    const messageBuffer = String.UTF8.encode(messageString, true);
    __hostPostGlobalChatMessage(messageBuffer, messageBuffer.byteLength, color.toPackedBGR(), isEventful);
}

// @ts-ignore
@inline
export function postPlayerMessage(playerState: BadLadsObject, messageString: string, color: Color = Color.WHITE, isEventful: bool = false): void {
    const messageBuffer = String.UTF8.encode(messageString, true);
    __hostPostPlayerChatMessage(playerState, messageBuffer, messageBuffer.byteLength, color.toPackedBGR(), isEventful);
}

/**
 * Decode a linear memory UTF8 ArrayBuffer into a string. 
 * @param message 
 * @returns 
 */
// @ts-ignore
@inline
export function decodeString(message: ArrayBuffer): string {
    return String.UTF8.decode(message, true);
}

/**
 * @returns The host's game version.
 */
// @ts-ignore
@inline
export function getBadLadsVersion(): String {
    return String.UTF8.decode(__hostGetBadLadsVersionOwnedString());
}

/**
 * Returns all object with the matching Object flags.
 * @param flags 
 * @returns 
 */
// @ts-ignore
@inline
export function getObjectsIdsByType(flags: BadLadsObjectFlags): Uint64Array {
    return Uint64Array.wrap(__hostGetObjectIdsOwnedUInt64s(flags));
}

/**
 * Set the objects server transform.
 * @param object A transformable object.
 * @param transform 
 * @returns 
 */
// @ts-ignore
@inline
export function setObjectTransform(object: BadLadsObject, transform: Transform): bool {
    return __hostSetObjectTransform(object, transform.position.x, transform.position.y, transform.position.z, 
        transform.rotation.pitch, transform.rotation.yaw, transform.rotation.roll, 
            transform.scale.x, transform.scale.y, transform.scale.z);
}

/**
 * Get the objects transform.
 * @param objectId 
 * @returns 
 */
// @ts-ignore
@inline
export function getObjectTransform(objectId: BadLadsObject): Transform | null {
    const transformBuffer: Float32Array = Float32Array.wrap(__hostGetObjectTranformOwnedF32s(objectId));
    if(transformBuffer != null) {
        return new Transform(
            new Vector(transformBuffer[0], transformBuffer[1], transformBuffer[2]), 
            new Rotation(transformBuffer[3],transformBuffer[4],transformBuffer[5]), 
            new Vector(transformBuffer[6],transformBuffer[7],transformBuffer[8]));
    }
    return null;
}

/**
 * Returns the name of the object flags class. Object flags can be extracted from BadLadsObject id's.
 * @param objectFlag Must be a single flag.
 * @returns 
 */
// @ts-ignore
@inline
export function getObjectFlagClassName(objectFlag: BadLadsObjectFlags) : string {
    return decodeString(__hostGetObjectClassNameOwnedString(objectFlag));
}

/**
 * 
 * @param objectFlag What type of object do want to spawn in? Must be a single flag.
 * @param objectIndex The object's index, different for each object category.
 * @param transform 
 * @param bAsync If enabled the object will spawn async and not return a object id.
 * @returns 
 */
// @ts-ignore
@inline
export function spawnObject(objectFlag: BadLadsObjectFlags, objectIndex: i32, transform: Transform, bAsync: bool = false): BadLadsObject {
    return __hostSpawnObject(objectFlag, objectIndex,  bAsync,
        transform.position.x, transform.position.y, transform.position.z, 
        transform.rotation.pitch, transform.rotation.yaw, transform.rotation.roll, 
            transform.scale.x, transform.scale.y, transform.scale.z);
}

/**
 * 
 * @param playerState 
 * @returns The unique id of the playerstate, under a Steam server this would a 64 bit SteamId. Returns 0 if playerstate was not found.
 */
// @ts-ignore
@inline
export function getPlayerAccountId(playerState: BadLadsObject): u64 {
    return __hostGetPlayerAccountId(playerState);
}

export function getPlayerName(playerState: BadLadsObject): string {
    return decodeString(__hostGetPlayerNameOwnedString(playerState));
}

// @ts-ignore
@inline
export function kickPlayer(playerState: BadLadsObject): bool {
    const playerAccountId = getPlayerAccountId(playerState);
    if(playerAccountId != 0) {
        return __hostKickPlayerAccountId(playerAccountId);
    }
    return false;
}

// @ts-ignore
@inline
export function banPlayer(playerState: BadLadsObject): BadLadsBanReply {
    const playerAccountId = getPlayerAccountId(playerState);
    if(playerAccountId != 0) {
        return __hostBanPlayerAccountId(playerAccountId);
    }
    return BadLadsBanReply.InvalidPlayerId;
}

/**
 * 
 * @param playerState 
 * @param newHealth The new health, if this is set to 0 the object will die. 
 * @returns whether we have successfully set the living objects health.
 */
// @ts-ignore
@inline
export function setLivingHealth(playerState: BadLadsObject, newHealth: i32): bool {
    return __hostSetObjectHealth(playerState, newHealth)
}

/**
 * 
 * @param doorObject The EstateObject that is a door.
 * @param state 0 is closed, 1 is open forwards and -1 is open backwards.
 * @returns 
 */
// @ts-ignore
@inline
export function setDoorState(doorObject: BadLadsObject, state: i32): bool {
    return __hostSetDoorState(doorObject, state);
}

/**
 * Returns all the owned buildables by the estate volume.
 * @param estateVolume 
 * @returns All of the Estate Volume objects owned buildables, represented as BadLadsObject id's. 
 */
// @ts-ignore
@inline
export function getEstateVolumeBuildables(estateVolume: BadLadsObject): Uint64Array {
    return Uint64Array.wrap(__hostGetEstateBuildableObjectsUInt64s(estateVolume));
}

/**
 * Give a playerState an item.
 * @param playerState 
 * @param itemId 
 * @param stackSize 
 * @param autoStack 
 * @returns whether the player received said item, could be false in case of a full inventory. 
 */
// @ts-ignore
@inline
export function giveItem(playerState: BadLadsObject, itemId: i32, stackSize: i32 = 1, autoStack: bool = true) : bool {
    return __hostGivePlayerStateItem(playerState, itemId, stackSize, autoStack);
}

/**
 * @param object 
 * @returns a static array of 2 vectors. 1st one being the center of the bounds, second one being the extents.
 */
// @ts-ignore
@inline
export function getObjectBounds(object: BadLadsObject): StaticArray<Vector> {
    var array = new StaticArray<Vector>(2);
    var centerAndBounds = Float32Array.wrap(__hostGetObjectBoundsOwnedF32s(object));
    array[0] = new Vector(centerAndBounds[0], centerAndBounds[1], centerAndBounds[2]);
    array[1] = new Vector(centerAndBounds[3], centerAndBounds[4], centerAndBounds[5]);
    return array;
}

// @ts-ignore
@inline
export function getPlayerJob(playerState: BadLadsObject): string {
    return decodeString(__hostGetPlayerJobOwnedString(playerState));
}

// @ts-ignore
@inline
export function setPlayerJob(playerState: BadLadsObject, job: string, bBroadcastBecome: bool = true, 
    bCheckForAvailability: bool = false, bTryRespawn: bool = true, bWasDemoted: bool = false, bForceRespawn: bool = false): bool {
    const jobBuffer = String.UTF8.encode(job, true);

    return __hostSetPlayerJob(playerState, jobBuffer, jobBuffer.byteLength, bBroadcastBecome, bCheckForAvailability, bTryRespawn, bWasDemoted, bForceRespawn);
}

/**
 * Traces a line through a select collision world  
 * @param start The start of the line.
 * @param end The end of the line.
 * @param collisionChannel collision world channel.
 * @returns distance to collision, if any.
 */
// @ts-ignore
@inline
export function rayTrace(start: Vector, end: Vector, collisionChannel: BadLadsCollisionChannel = BadLadsCollisionChannel.WorldStatic, ignoredObject: BadLadsObject = 0): f32 {
    return __hostRaytrace(ignoredObject, collisionChannel, start.x, start.y, start.z, end.x, end.y, end.z);
}

/**
 * 
 * @returns server game time in seconds.
 */
// @ts-ignore
@inline
export function getGameTime(): f64  {
    return __hostGetGameTime();
}

// @ts-ignore
@inline
export function getEconomyCurrencyValue(): f32 {
    return __hostGetEconomyCurrencyValue();
}