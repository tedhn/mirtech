def build_filtered_query(supabase, active, gender, filter, select_cols: str, include_count: bool):

    query_builder = supabase.table("users").select(
        select_cols,
        count="exact" if include_count else None
    )
    
    # Search filter
    if filter:
        search_term = f"%{filter.strip()}%"
        or_condition_string = (
            f"first_name.ilike.{search_term},"
            f"last_name.ilike.{search_term},"
            f"email.ilike.{search_term}"
        )

        query_builder = query_builder.or_(or_condition_string)

    # Active filter
    if active is not None:
        is_active = True if active == "active" else False
        query_builder = query_builder.eq("is_active", is_active)

    # Gender filter
    if gender:
        query_builder = query_builder.eq("gender", gender)

    return query_builder