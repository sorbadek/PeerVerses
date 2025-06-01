#[allow(duplicate_alias)]
module wer::storage {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::String;
    use std::vector;

    // Error codes
    const EUnauthorizedAccess: u64 = 1;
    const EInvalidFileType: u64 = 2;
    const EFileSizeExceeded: u64 = 3;
    const EFileNotFound: u64 = 4;

    // File types
    const FILE_TYPE_IMAGE: u8 = 1;
    const FILE_TYPE_VIDEO: u8 = 2;
    const FILE_TYPE_PDF: u8 = 3;
    const FILE_TYPE_OTHER: u8 = 4;    public struct StorageRegistry has key {
        id: UID,
        files: Table<address, vector<FileMetadata>>,
        admin: address
    }

    public struct FileMetadata has store {
        file_id: String,
        owner: address,
        file_type: u8,
        file_size: u64,
        file_hash: vector<u8>,
        walrus_url: String,
        upload_time: u64,
        is_deleted: bool
    }

    public struct FileUploaded has copy, drop {
        file_id: String,
        owner: address,
        file_type: u8,
        upload_time: u64
    }

    public struct FileDeleted has copy, drop {
        file_id: String,
        owner: address,
        deletion_time: u64
    }

    fun init(ctx: &mut TxContext) {
        let storage = StorageRegistry {
            id: object::new(ctx),
            files: table::new(ctx),
            admin: tx_context::sender(ctx)
        };
        transfer::share_object(storage);
    }    public entry fun register_file(
        storage: &mut StorageRegistry,
        file_id: String,
        file_type: u8,
        file_size: u64,
        file_hash: vector<u8>,
        walrus_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate file type and size
        assert!(is_valid_file_type(file_type), EInvalidFileType);
        assert!(file_size <= 52428800, EFileSizeExceeded); // 50MB limit

        let owner = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        let metadata = FileMetadata {
            file_id,
            owner,
            file_type,
            file_size,
            file_hash,
            walrus_url,
            upload_time: current_time,
            is_deleted: false
        };

        if (!table::contains(&storage.files, owner)) {
            table::add(&mut storage.files, owner, vector::empty());
        };

        let user_files = table::borrow_mut(&mut storage.files, owner);
        vector::push_back(user_files, metadata);

        event::emit(FileUploaded {
            file_id,
            owner,
            file_type,
            upload_time: current_time
        });
    }

    public entry fun mark_file_deleted(
        storage: &mut StorageRegistry,
        file_id: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {        let owner = tx_context::sender(ctx);
        assert!(table::contains(&storage.files, owner), EFileNotFound);

        let user_files = table::borrow_mut(&mut storage.files, owner);
        let files_len = vector::length(user_files);
        let mut i = 0;
        
        while (i < files_len) {
            let file = vector::borrow_mut(user_files, i);
            if (file.file_id == file_id && !file.is_deleted) {
                file.is_deleted = true;
                event::emit(FileDeleted {
                    file_id,
                    owner,
                    deletion_time: clock::timestamp_ms(clock)
                });
                break
            };
            i = i + 1;
        }
    }

    public fun get_user_files(
        storage: &StorageRegistry,
        owner: address
    ): &vector<FileMetadata> {
        assert!(table::contains(&storage.files, owner), EFileNotFound);
        table::borrow(&storage.files, owner)
    }

    public entry fun update_admin(
        storage: &mut StorageRegistry,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == storage.admin, EUnauthorizedAccess);
        storage.admin = new_admin;
    }

    // Helper function to validate file type
    public fun is_valid_file_type(file_type: u8): bool {
        file_type == FILE_TYPE_IMAGE || 
        file_type == FILE_TYPE_VIDEO || 
        file_type == FILE_TYPE_PDF || 
        file_type == FILE_TYPE_OTHER
    }
}
