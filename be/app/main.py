import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client, create_client
from dotenv import load_dotenv
from .models import Address, UserDeleteResponse, UserResponse, UserCreateRequest, UserCreateResponse, UserResponseById, UserUpdateRequest, UserUpdateResponse
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from .helper import build_filtered_query

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins - change this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class PaginatedResponse(BaseModel):
    data: list[UserResponse]
    total: int
    page: int
    next : Optional[int] = None
    page_size: int
    total_pages: int

@app.get("/")
async def root():
    return {"message": "Welcome to the MirTech Backend!"}

@app.get("/users", response_model=PaginatedResponse)
async def get_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    filter: Optional[str] = Query(None, description="Filter by name or email"),
    active: Optional[str] = Query(None, description="Filter by active status"),
    gender: Optional[str] = Query(None, description="Filter by gender")
) -> PaginatedResponse:
    try:
        # --- Get Total Count (with filters applied) ---
        count_query = build_filtered_query(supabase, active, gender, filter, "id", include_count=True)
        count_response = count_query.execute()
        total_count = count_response.count
        
        # --- Get Paginated Data (with filters applied) ---
        data_query = build_filtered_query(supabase, active, gender, filter, "*", include_count=False)
        
        # Calculate offset and apply range for pagination
        offset = (page - 1) * page_size
        response = data_query.range(offset, offset + page_size - 1).execute()
        
        # Transform the data using UserResponse model
        transformed_users = []
        for user in response.data:
            user_response = UserResponse(
                id=user.get("id"),
                name=f"{user.get('first_name', '')} {user.get('last_name', '')}".strip(),
                email=user.get("email", ""),
                phone=user.get("phone", ""),
                address=Address(
                    address=user.get("address", ""),
                    city=user.get("city", ""),
                    zip_code=user.get("zip_code", ""),
                    country=user.get("country", "")
                ),
                date_of_birth=user.get("date_of_birth"),
                gender=user.get("gender"),
                created_at=user.get("created_at"),
                last_login=user.get("last_login"),
                is_active=user.get("is_active", False)
            )
            transformed_users.append(user_response)
        
        # Calculate total pages
        total_pages = (total_count + page_size - 1) // page_size
        
        return PaginatedResponse(
            data=transformed_users,
            total=total_count,
            page=page,
            next=page + 1 if page * page_size < total_count else None,
            page_size=page_size,
            total_pages=total_pages
        )
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/users/{user_id}", response_model=UserResponseById)
async def get_user_by_id(user_id: str) -> UserResponseById:
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = response.data[0]
        
        user_response = UserResponseById(
            id=user.get("id"),
            first_name=f"{user.get('first_name', '')}",
            last_name=f"{user.get('last_name', '')}".strip(),
            email=user.get("email", ""),
            phone=user.get("phone", ""),
            address=Address(
                address=user.get("address", ""),
                city=user.get("city", ""),
                zip_code=user.get("zip_code", ""),
                country=user.get("country", "")
            ),
            date_of_birth=user.get("date_of_birth"),
            gender=user.get("gender"),
            created_at=user.get("created_at"),  
            last_login=user.get("last_login"),
            is_active=user.get("is_active", False)
        )
        
        return user_response
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching user by ID: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching the user: {str(e)}"
        )
    
@app.post("/users", response_model=UserCreateResponse, status_code=201)
async def create_user(user_data: UserCreateRequest) -> UserCreateResponse:
    try:
        # Check if email already exists
        existing_user = supabase.table("users").select("id").eq("email", user_data.email).execute()
        if existing_user.data:
            raise HTTPException(
                status_code=400, 
                detail="A user with this email already exists"
            )
        
        # Prepare data for insertion
        user_insert_data = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "email": user_data.email,
            "phone": user_data.phone,
            "address": user_data.address,
            "city": user_data.city,
            "zip_code": user_data.zip_code,
            "country": user_data.country,
            "date_of_birth": user_data.date_of_birth,
            "gender": user_data.gender,
            "is_active": user_data.is_active,
            "created_at": datetime.utcnow().isoformat(),
            "last_login": None
        }
        
        # Insert user into database
        response = supabase.table("users").insert(user_insert_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create user"
            )
        
        created_user = response.data[0]
        
        # Transform response
        user_response = UserCreateResponse(
            id=created_user.get("id"),
            first_name=f"{created_user.get('first_name', '')}",
            last_name=f"{created_user.get('last_name', '')}".strip(),
            email=created_user.get("email", ""),
            phone=created_user.get("phone", ""),
            address=Address(
                address=created_user.get("address", ""),
                city=created_user.get("city", ""),
                zip_code=created_user.get("zip_code", ""),
                country=created_user.get("country", "")
            ),
            date_of_birth=created_user.get("date_of_birth"),
            gender=created_user.get("gender"),
            created_at=created_user.get("created_at"),
            last_login=created_user.get("last_login"),
            is_active=created_user.get("is_active", False),
            message="User created successfully"
        )
        
        return user_response
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating user: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while creating the user: {str(e)}"
        ) 
        

@app.patch("/users/{user_id}", response_model=UserUpdateResponse)
async def update_user(user_id: str, user_data: UserUpdateRequest) -> UserUpdateResponse:
    try:
        # Check if user exists
        existing_user = supabase.table("users").select("id").eq("id", user_id).execute()
        if not existing_user.data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        # Check if email is being changed and if it's already taken by another user
        email_check = supabase.table("users").select("id").eq("email", user_data.email).execute()
        if email_check.data and email_check.data[0].get("id") != int(user_id):
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists"
            )
        
        # Prepare data for update
        user_update_data = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "email": user_data.email,
            "phone": user_data.phone,
            "address": user_data.address,
            "city": user_data.city,
            "zip_code": user_data.zip_code,
            "country": user_data.country,
            "date_of_birth": user_data.date_of_birth,
            "gender": user_data.gender,
            "is_active": user_data.is_active,
        }
        
        # Update user in database
        response = supabase.table("users").update(user_update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to update user"
            )
        
        updated_user = response.data[0]
        
        # Transform response
        user_response = UserUpdateResponse(
            id=updated_user.get("id"),
            first_name=f"{updated_user.get('first_name', '')}",
            last_name=f"{updated_user.get('last_name', '')}".strip(),
            email=updated_user.get("email", ""),
            phone=updated_user.get("phone", ""),
            address=Address(
                address=updated_user.get("address", ""),
                city=updated_user.get("city", ""),
                zip_code=updated_user.get("zip_code", ""),
                country=updated_user.get("country", "")
            ),
            date_of_birth=updated_user.get("date_of_birth"),
            gender=updated_user.get("gender"),
            created_at=updated_user.get("created_at"),
            last_login=updated_user.get("last_login"),
            is_active=updated_user.get("is_active", False),
            message="User updated successfully"
        )
        
        return user_response
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        # Log the error for debugging
        print(f"Error updating user: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while updating the user: {str(e)}"
        )
        
# ... (Continuing from your existing code)

@app.delete("/users/{user_id}", response_model=UserDeleteResponse)
async def delete_user(user_id: str) -> UserDeleteResponse:

    try:
        existing_user_response = supabase.table("users").select("id").eq("id", user_id).execute()
        
        if not existing_user_response.data:
            raise HTTPException(
                status_code=404,
                detail=f"User with ID {user_id} not found"
            )
            
        delete_response = supabase.table("users").delete().eq("id", user_id).execute()

        deleted_id = int(user_id) if user_id.isdigit() else user_id
        
        return UserDeleteResponse(
            id=deleted_id,
            message=f"User with ID {user_id} deleted successfully"
        )
        
    except HTTPException as he:
        # Re-raise HTTP exceptions (e.g., the 404)
        raise he
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting user: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while deleting the user: {str(e)}"
        )