def build_filtered_query(supabase, active , gender , filter, select_cols: str, include_count: bool):
    query_builder = supabase.table("users").select(
        select_cols, 
        count="exact" if include_count else None
    )

    # 1. Apply 'active' filter
    if active is not None:
        is_active = True if active == "active" else False
        print(f"Filtering by is_active: {is_active}")
        query_builder = query_builder.eq("is_active", is_active)

    # 2. Apply 'gender' filter (TRANSFORMED)
    if gender:
        db_gender = format_gender_input(gender)
        query_builder = query_builder.eq("gender", db_gender)

    # 3. Apply 'filter' (name/email search) filter
    if filter:
        for word in filter.split():
            search_term = f"%{word}%"
            
            or_condition = (
                f"first_name.ilike.{search_term},"
                f"last_name.ilike.{search_term},"
                f"email.ilike.{search_term}"
            )
            
            query_builder = query_builder.or_(or_condition)
    
    return query_builder


def format_gender_input(input_gender: str) -> str:
    normalized = input_gender.replace('-', ' ').lower()
    if normalized == 'male':
        return 'Male'
    if normalized == 'female':
        return 'Female'
    return normalized.title()